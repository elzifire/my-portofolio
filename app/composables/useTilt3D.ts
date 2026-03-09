import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useTilt3D(elementRef: Ref<HTMLElement | null>) {
  const rotateX = ref(0)
  const rotateY = ref(0)

  const handleMouseMove = (e: MouseEvent) => {
    if (!elementRef.value) return
    const rect = elementRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    rotateY.value = ((x - centerX) / centerX) * 10
    rotateX.value = ((centerY - y) / centerY) * 10
  }

  const handleMouseLeave = () => {
    rotateX.value = 0
    rotateY.value = 0
  }

  onMounted(() => {
    elementRef.value?.addEventListener('mousemove', handleMouseMove)
    elementRef.value?.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    elementRef.value?.removeEventListener('mousemove', handleMouseMove)
    elementRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  })

  return { rotateX, rotateY }
}
