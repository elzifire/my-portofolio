<template>
  <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-6 px-4">
    <div class="max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/games" class="inline-block mb-4 text-gray-400 hover:text-white transition-colors text-sm">
          &larr; {{ $t('wordleGame.back') }}
        </NuxtLink>
        <h1 class="text-4xl font-bold text-white mb-1 flex items-center justify-center gap-3">
          <span class="text-3xl">📝</span> {{ $t('wordleGame.title') }}
        </h1>
        <p class="text-gray-400 text-sm">{{ $t('wordleGame.subtitle') }}</p>
      </div>

      <!-- Board -->
      <div class="glass-card rounded-2xl p-4 sm:p-6 mb-5">
        <div class="flex flex-col items-center gap-2">
          <div v-for="(row, r) in guessRows" :key="r" class="flex gap-2">
            <div
              v-for="(cell, c) in row"
              :key="c"
              class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300 border-2"
              :class="cellClass(r, c, cell)"
            >
              {{ cell }}
            </div>
          </div>
        </div>
      </div>

      <!-- Message -->
      <div v-if="message" class="text-center mb-4">
        <span class="inline-block px-4 py-2 rounded-full text-sm font-semibold" :class="messageClass">
          {{ message }}
        </span>
      </div>

      <!-- Keyboard -->
      <div class="flex flex-col items-center gap-1.5 mb-5">
        <div v-for="(row, i) in keyboardRows" :key="i" class="flex gap-1.5">
          <button
            v-for="key in row"
            :key="key"
            @click="onKey(key)"
            class="rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center"
            :class="keyClass(key)"
            :style="keyStyle(key)"
          >
            {{ key === 'BACK' ? '⌫' : key }}
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex justify-center gap-3">
        <button @click="newGame()" class="px-5 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg text-sm">
          🔄 {{ $t('wordleGame.newWord') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()

const WORDS = [
  'about','above','abuse','actor','acute','admit','adopt','adult','after','again',
  'agent','agree','ahead','alarm','album','alert','alien','align','alive','allow',
  'alone','along','alter','amino','angel','anger','angle','angry','anime','apart',
  'apple','apply','arena','argue','arise','aside','asset','avoid','award','aware',
  'badge','basic','batch','beach','begin','being','below','bench','birth','black',
  'blade','blame','blank','blast','blaze','bleed','blend','bless','blind','block',
  'blood','blown','blues','board','bonus','bound','brain','brand','brave','bread',
  'break','breed','brick','bride','brief','bring','broad','broke','brook','brown',
  'brush','buddy','build','bunch','burst','buyer','cabin','cable','candy','carry',
  'catch','cause','chain','chair','chaos','charm','chart','chase','cheap','check',
  'cheek','chess','chest','chief','child','china','chunk','civic','civil','claim',
  'clash','class','clean','clear','climb','cling','click','cliff','climb','clock',
  'clone','close','cloth','cloud','coach','coast','count','court','cover','crack',
  'craft','crash','crazy','cream','crime','cross','crowd','crown','crush','curve',
  'cycle','dance','death','debug','delay','delta','dense','depth','derby','devil',
  'diary','dirty','disco','doubt','draft','drain','drama','drawn','dream','dress',
  'drift','drill','drink','drive','drone','drove','dying','eager','early','earth',
  'eight','elect','elite','ember','empty','enemy','enjoy','enter','entry','equal',
  'error','essay','event','every','exact','exile','exist','extra','faint','faith',
  'false','fault','feast','fence','ferry','fever','fiber','field','fifth','fifty',
  'fight','final','first','fixed','flame','flash','flesh','float','flood','floor',
  'flour','fluid','flush','focus','force','forge','forty','forum','found','frame',
  'frank','fraud','fresh','front','frost','fruit','fully','ghost','giant','given',
  'glass','globe','gloom','glory','grace','grade','grain','grand','grant','graph',
  'grasp','grass','grave','great','green','greet','grief','grill','grind','gross',
  'group','grove','grown','guard','guess','guest','guide','guild','guilt','happy',
  'harsh','haven','heart','heavy','hello','hence','honor','horse','hotel','house',
  'human','humor','ideal','image','imply','index','indie','inner','input','issue',
  'ivory','japan','jewel','joint','judge','juice','known','label','large','laser',
  'later','laugh','layer','learn','least','leave','legal','level','light','limit',
  'linen','liver','local','loose','lover','lower','lucky','lunch','magic','major',
  'maker','manor','march','match','mayor','medal','media','mercy','merge','metal',
  'meter','might','minor','minus','mixed','model','money','month','moral','motor',
  'mount','mouse','mouth','movie','music','naval','nerve','never','night','noble',
  'noise','north','noted','novel','nurse','occur','ocean','offer','often','olive',
  'onset','opera','orbit','order','organ','other','outer','owner','oxide','ozone',
  'paint','panic','paper','patch','peace','peach','pearl','penny','phase','phone',
  'photo','piano','piece','pilot','pixel','pizza','place','plain','plane','plant',
  'plate','plaza','point','polar','pound','power','press','price','pride','prime',
  'prince','print','prior','proof','proud','prove','proxy','pulse','pupil','queen',
  'query','quest','queue','quick','quiet','quite','quota','quote','radar','radio',
  'raise','rally','range','rapid','ratio','reach','react','ready','realm','rebel',
  'refer','reign','relax','reply','rider','ridge','rifle','rigid','rival','river',
  'robin','robot','rocky','roman','rough','round','route','royal','rural','saint',
  'salad','sauce','scale','scene','scope','score','sense','serve','setup','seven',
  'shade','shake','shall','shame','shape','share','sharp','sheep','sheer','sheet',
  'shelf','shell','shift','shine','shirt','shock','shoot','shore','short','shout',
  'sight','sigma','since','sixth','sixty','sized','skill','skull','slave','sleep',
  'slice','slide','slope','smart','smell','smile','smoke','snake','solar','solid',
  'solve','sorry','sound','south','space','spare','speak','speed','spend','spine',
  'split','spoke','sport','spray','squad','stack','staff','stage','stake','stand',
  'stare','start','state','stays','steal','steam','steel','steep','steer','stern',
  'stick','stiff','still','stock','stone','stood','storm','story','stove','strap',
  'straw','strip','stuck','study','stuff','style','sugar','suite','super','surge',
  'swamp','swear','sweep','sweet','swift','swing','sword','swore','swung','taste',
  'teach','teeth','theme','thick','thing','think','third','those','three','throw',
  'thumb','tiger','tight','timer','title','today','token','total','touch','tough',
  'tower','toxic','trace','track','trade','trail','train','trait','trash','treat',
  'trend','trial','tribe','trick','troop','truck','truly','trump','trunk','trust',
  'truth','tumor','twelfth','twice','twist','ultra','uncle','under','union','unite',
  'unity','until','upper','upset','urban','usage','usual','valid','value','vault',
  'venue','verse','video','vigor','viral','virus','visit','vital','vivid','vocal',
  'voice','voter','waste','watch','water','weave','wheat','wheel','where','which',
  'while','white','whole','whose','width','witch','woman','world','worry','worse',
  'worst','worth','would','wound','wrath','write','wrote','yield','young','youth',
]

const MAX_GUESSES = 6
const WORD_LEN = 5

const target = ref('')
const guesses = ref<string[]>([])
const currentGuess = ref('')
const gameOver = ref(false)
const message = ref('')

const keyboardRows = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','BACK'],
]

const guessRows = computed(() => {
  const rows: string[][] = []
  for (let r = 0; r < MAX_GUESSES; r++) {
    if (r < guesses.value.length) {
      rows.push(guesses.value[r].split(''))
    } else if (r === guesses.value.length) {
      const cur = currentGuess.value.split('')
      while (cur.length < WORD_LEN) cur.push('')
      rows.push(cur)
    } else {
      rows.push(Array(WORD_LEN).fill(''))
    }
  }
  return rows
})

const letterStates = computed(() => {
  const states: Record<string, 'correct' | 'present' | 'absent'> = {}
  for (const guess of guesses.value) {
    const result = evaluate(guess)
    for (let i = 0; i < WORD_LEN; i++) {
      const letter = guess[i].toUpperCase()
      const st = result[i]
      if (st === 'correct') states[letter] = 'correct'
      else if (st === 'present' && states[letter] !== 'correct') states[letter] = 'present'
      else if (!states[letter]) states[letter] = 'absent'
    }
  }
  return states
})

function evaluate(guess: string): ('correct' | 'present' | 'absent')[] {
  const result: ('correct' | 'present' | 'absent')[] = Array(WORD_LEN).fill('absent')
  const targetArr = target.value.split('')
  const guessArr = guess.toLowerCase().split('')
  const remaining: string[] = []

  // First pass: correct positions
  for (let i = 0; i < WORD_LEN; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct'
    } else {
      remaining.push(targetArr[i])
    }
  }
  // Second pass: present but wrong position
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] !== 'correct') {
      const idx = remaining.indexOf(guessArr[i])
      if (idx !== -1) {
        result[i] = 'present'
        remaining.splice(idx, 1)
      }
    }
  }
  return result
}

function cellClass(r: number, c: number, cell: string) {
  if (r < guesses.value.length) {
    const result = evaluate(guesses.value[r])
    if (result[c] === 'correct') return 'bg-green-600 border-green-500 text-white'
    if (result[c] === 'present') return 'bg-yellow-600 border-yellow-500 text-white'
    return 'bg-gray-600 border-gray-500 text-gray-300'
  }
  if (cell) return 'bg-gray-700/60 border-gray-500 text-white scale-105'
  return 'bg-white/5 border-white/10'
}

const messageClass = computed(() => {
  if (message.value.includes('🎉')) return 'bg-green-500/20 text-green-400'
  return 'bg-red-500/20 text-red-400'
})

function keyClass(key: string) {
  const base = 'hover:brightness-110 active:scale-95 '
  if (key === 'ENTER' || key === 'BACK') return base + 'bg-gray-600 text-xs px-2'
  const state = letterStates.value[key]
  if (state === 'correct') return base + 'bg-green-600'
  if (state === 'present') return base + 'bg-yellow-600'
  if (state === 'absent') return base + 'bg-gray-700 opacity-50'
  return base + 'bg-gray-600'
}

function keyStyle(key: string) {
  const wide = key === 'ENTER' || key === 'BACK'
  return {
    width: wide ? '3.2rem' : '2.2rem',
    height: '2.8rem',
    fontSize: wide ? '0.7rem' : '0.9rem',
  }
}

function onKey(key: string) {
  if (gameOver.value) return
  message.value = ''

  if (key === 'ENTER') {
    submitGuess()
  } else if (key === 'BACK') {
    currentGuess.value = currentGuess.value.slice(0, -1)
  } else if (currentGuess.value.length < WORD_LEN && /^[A-Z]$/.test(key)) {
    currentGuess.value += key
  }
}

function submitGuess() {
  if (currentGuess.value.length !== WORD_LEN) {
    message.value = t('wordleGame.notEnough')
    return
  }
  const word = currentGuess.value.toLowerCase()
  if (!WORDS.includes(word)) {
    message.value = t('wordleGame.notInList')
    return
  }

  guesses.value.push(currentGuess.value)
  if (word === target.value) {
    message.value = '🎉 ' + t('wordleGame.brilliant')
    gameOver.value = true
  } else if (guesses.value.length >= MAX_GUESSES) {
    message.value = t('wordleGame.theWordWas', { word: target.value.toUpperCase() })
    gameOver.value = true
  }
  currentGuess.value = ''
}

function newGame() {
  target.value = WORDS[Math.floor(Math.random() * WORDS.length)]
  guesses.value = []
  currentGuess.value = ''
  gameOver.value = false
  message.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.altKey || e.metaKey) return
  if (e.key === 'Enter') onKey('ENTER')
  else if (e.key === 'Backspace') onKey('BACK')
  else if (/^[a-zA-Z]$/.test(e.key)) onKey(e.key.toUpperCase())
}

onMounted(() => {
  newGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
