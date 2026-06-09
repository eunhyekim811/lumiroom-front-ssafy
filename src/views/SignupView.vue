<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-brand-bg px-4 py-12 text-gray-900">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-gray-900">회원 가입</h2>
        <p class="text-gray-400 text-xs font-semibold mt-2">LumiRoom의 정밀 공간 데이터 허브를 개방하세요.</p>
      </div>
      
      <form class="space-y-5" @submit.prevent>
        <div><label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">사용자 이름</label><input type="text" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point text-gray-900 outline-none transition placeholder-gray-400" placeholder="홍길동" /></div>
        <div><label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">이메일 주소</label><input type="email" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point text-gray-900 outline-none transition placeholder-gray-400" placeholder="name@example.com" /></div>
        <div><label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">비밀번호 설정</label><input type="password" class="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-brand-point text-gray-900 outline-none transition placeholder-gray-400" placeholder="••••••••" /></div>
        
        <button type="submit" class="w-full bg-brand-point hover:bg-yellow-500 text-gray-950 font-black py-3.5 px-4 rounded-xl transition shadow-lg transform active:scale-95 mt-4">
          회원 가입 완료하기
        </button>
      </form>
    </div>
  </div>
</template>