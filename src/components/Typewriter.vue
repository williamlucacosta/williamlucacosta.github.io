<template>
  <span 
    class="typewriter-text font-sfpro text-2xl font-bold ls-ultra" 
    ref="typewriterTextRef"
    />
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted, defineProps } from 'vue';

const roleText = useTemplateRef('typewriterTextRef');

// Definisci le props direttamente con `defineProps`
const props = defineProps({
    text: { type: String, required: true },
    typingSpeed: { type: Number, dafault: 100 },
    pauseBetweenCycles: { type: Number, default: 1000 },
});

let index = 0;
let direction = 1; // 1 = avanti, -1 = indietro

// Funzione per scrivere il testo
const runTypewriterEffect = () => {
    if (roleText.value != null) {

        roleText.value.innerHTML = props.text.slice(0, index);
        index += direction;

    // Controlla se ha raggiunto l'inizio o la fine del testo
        if (index === props.text.length + 1 || index === -1) {
            direction *= -1; // Cambia direzione
            if (index === props.text.length + 1) {
                index = props.text.length; // Assicura che l'indice sia al massimo alla fine del testo
            } else {
                index = 0; // Resetta l'indice quando torna indietro
            }
            setTimeout(runTypewriterEffect, props.pauseBetweenCycles); // Pausa lunga
            return;
        }

    // Chiama di nuovo la funzione con un ritardo per il prossimo carattere
        setTimeout(runTypewriterEffect, props.typingSpeed);
    }
};

// Quando il componente è montato, avvia l'effetto typewriter
onMounted(() => { runTypewriterEffect(); });
</script>

<script lang="ts">
export default {
    name: 'TypeWriter'  // Nome del componente con più di una parola
};
</script>


<style scoped>
.typewriter-text {
    border-right: 3px solid #236b70;
    /* white-space: nowrap;
    overflow: hidden;  */
    animation: blink 0.7s step-end infinite;
    background: linear-gradient(90deg, #00EEFF 0%, #00909A 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}


@keyframes blink {
  50% {
    border-color: transparent;
  }
}
</style>
