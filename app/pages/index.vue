<template>
  <div 
    class="min-h-screen transition-colors duration-300"
    :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'"
  >
    <Navbar />
    <HeroSection />
    <div class="section-divider"></div>
    <AboutSection />
    <div class="section-divider"></div>
    <EducationSection />
    <div class="section-divider"></div>
    <SkillsetSection />
    <div class="section-divider"></div>
    <ProjectsSection />
    <div class="section-divider"></div>
    <ContactSection />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'

const isDark = inject<Ref<boolean>>('isDark', ref(false))
</script>
