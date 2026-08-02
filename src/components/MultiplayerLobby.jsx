import React, { useState, useEffect } from 'react';
import { db, ref, set, onValue, push, remove, isFirebaseConfigured } from '../firebase';

const TEAMS = [
  { id: 'flame', name: '🔥 불꽃 팀', desc: '뜨거운 정열의 타자 팀' },
  { id: 'dragon', name: '🐉 용랑 팀', desc: '강력한 용의 기운 팀' },
  { id: 'phoenix', name: '🦅 봉황 팀', desc: '비상하는 날개짓 팀' },
  { id: 'thunder', name: '⚡ 뇌전 팀', desc: '번개 같은 스피드 팀' }
];

export const MultiplayerLobby = ({ user, userTeam, onSelectTeam, onStartMatch, onBack }) => {
  const [selectedTeam, setSelectedTeam] = useState(userTeam || 'flame');
  const [isSearching, setIsSearching] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState('');

  const handleTeamChange = (teamId) => {
    setSelectedTeam(teamId);
    onSelectTeam(teamId);
  };

  const handleStartMatchmaking = () => {
    setIsSearching(true);
    setMatchingStatus('팀 내 접속자 찾는 중...');

    if (!isFirebaseConfigured || !user) {
      // Firebase 미연동 시 모의 멀티플레이 매칭 진행
      setTimeout(() => {
        setMatchingStatus('팀 소속 매칭 상대 발견! 1v1 대전 시작!');
        setTimeout(() => {
          setIsSearching(false);
          onStartMatch({
            roomId: 'mock_room_' + Date.now(),
            opponentName: `팀원_${Math.floor(Math.random() * 900 + 100)}`,
            opponentCharId: 'iori'
          });
        }, 1000);
      }, 2000);
      return;
    }

    // Firebase Realtime DB 매칭 대기열 등록
    const queueRef = ref(db, `matchmaking/${selectedTeam}/${user.uid}`);
    set(queueRef, {
      uid: user.uid,
      name: user.displayName || '익명 팀원',
      timestamp: Date.now()
    });

    // 매칭 대기열 수신
    const teamQueueRef = ref(db, `matchmaking/${selectedTeam}`);
    const unsubscribe = onValue(teamQueueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uids = Object.keys(data);
        if (uids.length >= 2) {
          const opponentUid = uids.find(id => id !== user.uid);
          if (opponentUid) {
            const opponent = data[opponentUid];
            setMatchingStatus(`팀원 (${opponent.name})과 매칭 완료! 대전 입장...`);
            
            // 대기열 제거 후 대전 시작
            remove(ref(db, `matchmaking/${selectedTeam}/${user.uid}`));

            setTimeout(() => {
              setIsSearching(false);
              onStartMatch({
                roomId: `room_${user.uid}_${opponentUid}`,
                opponentName: opponent.name,
                opponentCharId: 'iori'
              });
            }, 1000);
          }
        }
      }
    });

    return () => {
      remove(queueRef);
      unsubscribe();
    };
  };

  return (
    <div className="w-full max-w-3xl bg-slate-900/90 border-4 border-amber-500/80 rounded-2xl p-6 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-md">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6 border-b border-amber-500/30 pb-4">
        <div>
          <h2 className="text-2xl font-black italic text-amber-400">⚔️ 팀 소속 실시간 1v1 랜덤 매칭</h2>
          <p className="text-xs text-gray-400">자신이 속한 팀 멤버와 실시간으로 각자의 컴퓨터에서 타자 격투를 펼칩니다!</p>
        </div>
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold border border-slate-700"
        >
          ← 뒤로 가기
        </button>
      </div>

      {/* 팀 선택 카세트 */}
      <h3 className="text-sm font-bold text-gray-300 mb-3">소속 팀 선택 (팀원끼리만 매칭됩니다)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {TEAMS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTeamChange(t.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedTeam === t.id
                ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="text-lg font-black text-amber-300">{t.name}</div>
            <div className="text-xs text-gray-400 mt-1">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* 매칭 검색 버튼 영역 */}
      <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 text-center flex flex-col items-center">
        {isSearching ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lg font-bold text-amber-300 animate-pulse">{matchingStatus}</p>
            <button
              onClick={() => setIsSearching(false)}
              className="mt-4 text-xs text-gray-400 hover:text-white underline"
            >
              매칭 취소
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-300 mb-4 font-semibold">
              선택한 <strong className="text-amber-400">[{TEAMS.find(t => t.id === selectedTeam)?.name}]</strong> 멤버와 실시간 매칭을 시작합니다.
            </p>
            <button
              onClick={handleStartMatchmaking}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xl px-10 py-4 rounded-xl shadow-[0_0_25px_#f59e0b] border-2 border-yellow-300 transform hover:scale-105 transition-all"
            >
              팀원 매칭 시작! ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
