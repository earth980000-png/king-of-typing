import React, { useState } from 'react';
import { db, ref, set, onValue, remove, isFirebaseConfigured } from '../firebase';

export const MultiplayerLobby = ({ user, onStartMatch, onBack }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState('');

  const handleStartMatchmaking = () => {
    setIsSearching(true);
    setMatchingStatus('접속 중인 상대를 찾는 중...');

    if (!isFirebaseConfigured || !user) {
      setTimeout(() => {
        setMatchingStatus('대전 상대 발견! 1v1 아케이드 매치 시작!');
        setTimeout(() => {
          setIsSearching(false);
          onStartMatch({
            roomId: 'mock_room_' + Date.now(),
            opponentName: `격투가_${Math.floor(Math.random() * 900 + 100)}`,
            opponentCharId: 'iori'
          });
        }, 1000);
      }, 1500);
      return;
    }

    // 글로벌 매칭 대기열 등록 (팀 제한 완전 제거)
    const queueRef = ref(db, `matchmaking/global/${user.uid}`);
    set(queueRef, {
      uid: user.uid,
      name: user.displayName || '익명 도전자',
      timestamp: Date.now()
    });

    const globalQueueRef = ref(db, `matchmaking/global`);
    const unsubscribe = onValue(globalQueueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uids = Object.keys(data);
        if (uids.length >= 2) {
          const opponentUid = uids.find(id => id !== user.uid);
          if (opponentUid) {
            const opponent = data[opponentUid];
            setMatchingStatus(`도전자 (${opponent.name}) 매칭 완료! 경기장 입장...`);
            
            remove(ref(db, `matchmaking/global/${user.uid}`));

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
    <div className="w-full max-w-2xl bg-[#0c1017] border border-amber-500/40 rounded-2xl p-6 text-white shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-black italic text-[#f5a623]">⚔️ 실시간 1v1 랜덤 대전</h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">ANY USER CAN MATCH INSTANTLY OVER LOCAL / NETWORK</p>
        </div>
        <button
          onClick={onBack}
          className="bg-[#141923] hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs font-mono font-bold border border-slate-700 transition-colors"
        >
          ← MAIN MENU
        </button>
      </div>

      {/* Matching Card */}
      <div className="bg-[#05070c] rounded-xl p-8 border border-slate-800 text-center flex flex-col items-center">
        {isSearching ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#f5a623] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-base font-mono font-bold text-amber-300 animate-pulse">{matchingStatus}</p>
            <button
              onClick={() => setIsSearching(false)}
              className="mt-5 text-xs font-mono text-slate-400 hover:text-white underline"
            >
              CANCEL MATCHMAKING
            </button>
          </div>
        ) : (
          <div className="py-4">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-xl font-bold text-white mb-2">실시간 1v1 즉시 매칭</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
              팀 제한 없이 누구나 대전에 참여할 수 있습니다. <br />
              타자 속도가 더 빠른 사람이 상대를 KO 시킵니다!
            </p>
            <button
              onClick={handleStartMatchmaking}
              className="bg-[#f5a623] hover:bg-amber-400 text-black font-black text-lg uppercase tracking-wider px-10 py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,166,35,0.4)] border border-yellow-200 transform hover:scale-105 transition-all"
            >
              대전 상대 찾기! ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
