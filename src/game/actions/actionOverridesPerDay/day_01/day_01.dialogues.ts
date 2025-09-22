import { CHARACTERS, MOODS } from "@/constants/game";
import { alternatives, dialogue } from "@/utils/dialogues";

export const dialogues = {
  welcome: () => [
    dialogue.josef.neutral`
      This cell is my new home.
      I was jailed for not speaking German in Germany.
      Logic... or absurdity?
    `,
    dialogue.josef.neutral`
      I don’t want to do anything.
      I don’t want to think.
      I just want to sleep.
    `,
  ],
  marlene_first_interaction: () => [
    dialogue.marlene.neutral`
      Prisoner Josef G.
      Already feeling at home in your cell?
    `,
    dialogue.marlene.neutral`
      In ten minutes your first test begins. 
      The topic: "GREETINGS" in German.
    `,
    dialogue.marlene.neutral`
      Do well, and you eat.
      Fail and you will spend a day hungry to try to improve...
    `,
    dialogue.josef.sad`
      But… I have no books. 
      Nothing to study with.
    `,
    dialogue.marlene.happy`
      [MARLENE SMILES] That’s your problem. 
      See you in ten minutes.
    `,
  ],
  bed_alternatives: () => [
    alternatives.josef.neutral`
      What do you want to do?
    `.alternatives(
      {
        id: "sleeping_with_ghosts",
        text: "Sleep until the challenge arrives",
      },
      {
        id: "nothing",
        text: "Do nothing",
      }
    ),
  ],
  dream_introduction: () => [
    dialogue.josef.neutral`
      Espera ai...
      Será que eu morri..
      E virei um Fantasma?
    `,
    dialogue.josef.happy`
      Quer dizer que eu nõa preciso mais
      voltar para aquela prisão?
    `,
    dialogue.elisa.neutral`
      Você não morreu Josef...
      Você apenas está sonhando...
      Que é um Fantasma
    `.reactions([
      {
        character: CHARACTERS.JOSEF,
        mood: MOODS.SURPRISED,
      },
    ]),
    dialogue.josef.surprised`
      De que é esta voz...
      Quem é você?
    `,
    dialogue.elisa.surprised`
      Ande um pouco para frente...
      E você verá meu querido
    `,
  ],
  greetings_lesson: () => [
    dialogue.josef.surprised`
      Mas... quem é você? 
      Por que uma freira está falando comigo em um cemitério?
    `.reactions([
      {
        mood: MOODS.TALKING,
        character: CHARACTERS.ELISA,
      },
    ]),
    dialogue.elisa.flushed`
      Ah, claro... apresentações.
      Meu nome é Eliska. 
      Morri de fome na mesma cela onde você está agora.
    `,
    dialogue.josef.sad`
      Eliska...? Freira... 
      Você é então... Santa Virgem Eliska?
      Eu já ouvi falar de você. 
      A santa dos expatriados.
      Você foi presa por ensinar alemão a imigrantes...
    `,
    dialogue.elisa.happy`
      "Santa Virgem Eliska"... sim, já ouvi isso mais vezes do que gostaria. 
      Se ao menos essa santidade toda viesse com um vale-refeição…
    `,
    dialogue.elisa.happy`
      E sim, eu morri por dar aulas para imigrantes...
      Que, ao contrário do que dizem, não eram nada grátis.
      Tinha até pacote premium.
      Comprei muita vodka e cigarro com essas aulas.
    `,
    dialogue.elisa.talking`
      Agora, surpresa! 
      A Santa Virgem aqui não foi para o céu, mas ficou aqui.
      Não tem TV, então minha diversão é espiar você na cela
      e invadir seus sonhos de vez em quando.
    `,
    dialogue.josef.surprised`
      Então... você vê tudo que eu faço na minha cela?
    `,
    dialogue.elisa.angry`
      Sim. 
      Oh Deus, o que eu fiz para merecer esse castigo...
      E também sinto cheiro. 
      Josef, coma mais fibra e beba mais água.
      Sua cela fede mais que um cadáver.
      E olha que eu sou um.
    `,
    dialogue.elisa.angry`
      Eles transformaram o alemão em arma. 
      Eu ensino porque… é o que me resta.
      Palavras são a única coisa que ainda me obedecem.
      E você, Josef, precisa delas para comer.
    `,
    dialogue.josef.angry`
      E por que você faria isso por mim?
    `,
    dialogue.elisa.flushed`
      Porque achei você feio, mas com um bigode sexy.
    `,
    dialogue.josef.surprised`
      Mas... eu não tenho bigode!
    `,
    dialogue.elisa.happy`
      Oh, verdade! 
      Então retiro o "sexy".
      Continua só feio mesmo.
    `,
    dialogue.elisa.flushed`
      Mas vamos logo, antes que eu morra de tédio de novo.
      Primeira palavra: "Hallo".
    `,
    dialogue.josef.neutral`
      Hallo...
    `,
    dialogue.elisa.happy`
      Muito bem!
      Olha só, já parece menos ignorante.
      Agora: "Guten Morgen".
    `,
    dialogue.josef.neutral`
      Guten Morgen.
    `,
    dialogue.elisa.surprised`
      Olha só! Você não engasgou.
      Milagre maior do que dizem por aí sobre mim.
    `,
    dialogue.elisa.talking`
      Última: "Tschüss". 
      Quer dizer "Tchau".
      Útil pra encerrar conversas idiotas...
      como essa aqui.
    `,
    dialogue.josef.happy`
      Tschüss.
    `,
    dialogue.elisa.talking`
      Hah! Viu? Agora pode gritar "Tschüss"
      pros guardas. Talvez deixem você sair...
      ou só riam da sua cara.
    `,
    dialogue.elisa.talking`
      Agora acorde, Josef.
      Vou te mostrar como memorizar essas palavras.
      Spoiler: envolve uma tábua Ouija, não uma televisão.
    `,
  ],
};
