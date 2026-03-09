import { ref, onMounted, onUnmounted } from 'vue'

export function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const displayText = ref('')
  const isDeleting = ref(false)
  let wordIndex = 0
  let charIndex = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  const type = () => {
    const currentWord = words[wordIndex]
    
    if (isDeleting.value) {
      displayText.value = currentWord.substring(0, charIndex - 1)
      charIndex--
    } else {
      displayText.value = currentWord.substring(0, charIndex + 1)
      charIndex++
    }

    let delay = isDeleting.value ? deletingSpeed : typingSpeed

    if (!isDeleting.value && charIndex === currentWord.length) {
      delay = pauseTime
      isDeleting.value = true
    } else if (isDeleting.value && charIndex === 0) {
      isDeleting.value = false
      wordIndex = (wordIndex + 1) % words.length
      delay = 300
    }

    timeout = setTimeout(type, delay)
  }

  onMounted(() => type())
  onUnmounted(() => { if (timeout) clearTimeout(timeout) })

  return { displayText }
}
