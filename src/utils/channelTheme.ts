export function toBackgroundColor(channel: string): object {
  switch (channel) {
    case '赤井はあと': return { backgroundColor: '#FF6347' }; // tomato
    case 'アキロゼ':   return { backgroundColor: '#87CEFA' }; // lightskyblue
    case '戌神ころね': return { backgroundColor: '#F0E68C' }; // khaki
    case '大神ミオ':   return { backgroundColor: '#32CD32' }; // limegreen
    case '大空スバル': return { backgroundColor: '#ADFF2F' }; // greenyellow
    case 'さくらみこ': return { backgroundColor: '#F08080' }; // lightcoral
    case '白上フブキ': return { backgroundColor: '#C0C0C0' }; // silver
    case 'ときのそら': return { backgroundColor: '#4169E1' }; // royalblue
    case '百鬼あやめ': return { backgroundColor: '#FF7F50' }; // coral
    case '夏色まつり': return { backgroundColor: '#FFA500' }; // orange
    case '猫又おかゆ': return { backgroundColor: '#E6E6FA' }; // lavender
    case '湊あくあ':   return { backgroundColor: '#EE82EE' }; // violet
    case '紫咲シオン': return { backgroundColor: '#9932CC' }; // darkorchid
    case '癒月ちょこ': return { backgroundColor: '#FF69B4' }; // hotpink
    case '夜空メル':   return { backgroundColor: '#FFD700' }; // gold
    case 'ロボ子さん': return { backgroundColor: '#808080' }; // gray
    default: return { backgroundColor: '#F0F8FF' }; // aliceblue
  }
}

export function toEnglish(channel: string): string {
  switch (channel) {
    case '赤井はあと': return 'haato';
    case 'アキロゼ':   return 'aki';
    case '戌神ころね': return 'korone';
    case '大神ミオ':   return 'mio';
    case '大空スバル': return 'subaru';
    case 'さくらみこ': return 'miko';
    case '白上フブキ': return 'fubuki';
    case 'ときのそら': return 'sora';
    case '百鬼あやめ': return 'ayame';
    case '夏色まつり': return 'matsuri';
    case '猫又おかゆ': return 'okayu';
    case '湊あくあ':   return 'aqua';
    case '紫咲シオン': return 'sion';
    case '癒月ちょこ': return 'choco';
    case '夜空メル':   return 'melu';
    case 'ロボ子さん': return 'robo';
    default: return 'aqua';
  }
}
