import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface TestResult {
  wpm: number;
  accuracy: number;
  time: string;
  difficulty: string;
  date: string;
  language: string;
  duration: number;
}

interface DifficultyLevel {
  name: string;
  textLength: number;
}

interface Language {
  code: string;
  name: string;
  texts: string[];
}

const difficultyLevels: { [key: string]: DifficultyLevel } = {
  easy: { name: 'Easy', textLength: 100 },
  medium: { name: 'Medium', textLength: 200 },
  hard: { name: 'Hard', textLength: 300 }
};

const durations = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '1m' },
  { value: 120, label: '2m' },
  { value: 300, label: '5m' }
];

const languages: { [key: string]: Language } = {
  tr: {
    code: 'tr',
    name: 'Türkçe',
    texts: [
      "Hızlı kahverengi tilki tembel köpeğin üzerinden atlar ve ormanda koşar.",
      "Teknoloji dünyası sürekli gelişiyor ve her yıl yeni programlama dilleri ortaya çıkıyor.",
      "Yazılım geliştirme sürecinde ve günlük çalışmalarda hız ve doğruluk çok önemlidir.",
      "JavaScript modern web uygulamalarının ve mobil geliştirme çerçevelerinin temel taşıdır.",
      "Açık kaynak projeler yazılım dünyasının ve topluluğunun gelişmesine büyük katkı sağlar.",
      "Yapay zeka ve makine öğrenmesi teknolojileri günümüz dünyasında hızla gelişmektedir.",
      "Web tasarımında ve uygulama geliştirme süreçlerinde kullanıcı deneyimi çok önemlidir.",
      "Veri tabanı yönetimi modern uygulamaların ve sistemlerin temel gereksinimlerinden biridir.",
      "React kütüphanesi ile modern web uygulamaları geliştirmek geliştiriciler için çok kolay ve verimlidir.",
      "TypeScript JavaScript'e tip güvenliği ekler ve büyük ölçekli projelerde çok faydalıdır.",
      "Node.js ile sunucu tarafında JavaScript kullanarak güçlü uygulamaları verimli şekilde geliştirebilirsiniz.",
      "CSS Grid ve Flexbox ile responsive tasarımlar oluşturmak artık eskisinden çok daha kolay.",
      "Git versiyon kontrol sistemi günümüzde yazılım geliştirme sürecinin vazgeçilmez parçasıdır.",
      "RESTful prensipler ve GraphQL gibi teknolojiler modern API tasarımında yaygın olarak kullanılır.",
      "React Native ve Flutter çapraz platform mobil uygulama geliştirmede popüler seçeneklerdir.",
      "Python programlama dili veri bilimi ve yapay zeka alanlarında çok popülerdir.",
      "Bulut bilişim teknolojisi işletmelerin veri depolama ve işleme yöntemlerini dünya çapında devrim yaratmıştır.",
      "Siber güvenlik tehditleri giderek daha karmaşık hale geliyor ve günlük olarak gelişmiş koruma önlemleri gerektiriyor.",
      "Makine öğrenmesi algoritmaları büyük miktardaki veriyi analiz ederek kalıpları ve eğilimleri tespit edebilir.",
      "Blok zinciri teknolojisi güvenli işlemler ve veri bütünlüğü doğrulaması için merkezi olmayan çözümler sunar."
    ]
  },
  en: {
    code: 'en',
    name: 'English',
    texts: [
      "The quick brown fox jumps over the lazy dog and runs through the forest.",
      "Technology is constantly evolving and new programming languages are emerging every year.",
      "Speed and accuracy are very important in the software development process and daily work.",
      "JavaScript is the cornerstone of modern web applications and mobile development frameworks.",
      "Open source projects contribute greatly to the development of the software world and community.",
      "Artificial intelligence and machine learning technologies are developing rapidly in today's world.",
      "User experience is very important in web design and application development processes.",
      "Database management is one of the basic requirements of modern applications and systems.",
      "Developing modern web applications with React library is very easy and efficient for developers.",
      "TypeScript adds type safety to JavaScript and is very useful in large scale projects.",
      "With Node.js you can develop powerful applications using JavaScript on the server side efficiently.",
      "Creating responsive designs with CSS Grid and Flexbox is now much easier than before.",
      "Git version control system is an indispensable part of the software development process today.",
      "Technologies like RESTful principles and GraphQL are used extensively in modern API design.",
      "React Native and Flutter are popular choices in cross-platform mobile application development.",
      "Python programming language is very popular in data science and artificial intelligence fields.",
      "Cloud computing has revolutionized the way businesses store and process their data worldwide.",
      "Cybersecurity threats are becoming more sophisticated and require advanced protection measures daily.",
      "Machine learning algorithms can analyze vast amounts of data to identify patterns and trends.",
      "Blockchain technology offers decentralized solutions for secure transactions and data integrity verification."
    ]
  },
  es: {
    code: 'es',
    name: 'Español',
    texts: [
      "El zorro marrón rápido salta sobre el perro perezoso y corre por el bosque.",
      "La tecnología está evolucionando constantemente y nuevos lenguajes de programación emergen cada año.",
      "La velocidad y precisión son muy importantes en el proceso de desarrollo de software y trabajo diario.",
      "JavaScript es la piedra angular de las aplicaciones web modernas y frameworks de desarrollo móvil.",
      "Los proyectos de código abierto contribuyen enormemente al desarrollo del mundo del software y la comunidad.",
      "Las tecnologías de inteligencia artificial y aprendizaje automático se están desarrollando rápidamente en el mundo actual.",
      "La experiencia del usuario es muy importante en el diseño web y los procesos de desarrollo de aplicaciones.",
      "La gestión de bases de datos es uno de los requisitos básicos de las aplicaciones y sistemas modernos.",
      "Desarrollar aplicaciones web modernas con la biblioteca React es muy fácil y eficiente para los desarrolladores.",
      "TypeScript añade seguridad de tipos a JavaScript y es muy útil en proyectos de gran escala.",
      "Con Node.js puedes desarrollar aplicaciones potentes usando JavaScript en el lado del servidor de manera eficiente.",
      "Crear diseños responsivos con CSS Grid y Flexbox es ahora mucho más fácil que antes.",
      "El sistema de control de versiones Git es una parte indispensable del proceso de desarrollo de software hoy en día.",
      "Tecnologías como los principios RESTful y GraphQL se utilizan ampliamente en el diseño de API modernas.",
      "React Native y Flutter son opciones populares en el desarrollo de aplicaciones móviles multiplataforma.",
      "El lenguaje de programación Python es muy popular en los campos de ciencia de datos e inteligencia artificial.",
      "La computación en la nube ha revolucionado la forma en que las empresas almacenan y procesan sus datos en todo el mundo.",
      "Las amenazas de ciberseguridad se están volviendo más sofisticadas y requieren medidas de protección avanzadas diariamente.",
      "Los algoritmos de aprendizaje automático pueden analizar grandes cantidades de datos para identificar patrones y tendencias.",
      "La tecnología blockchain ofrece soluciones descentralizadas para transacciones seguras y verificación de integridad de datos."
    ]
  },
  fr: {
    code: 'fr',
    name: 'Français',
    texts: [
      "Le renard brun rapide saute par-dessus le chien paresseux et court à travers la forêt.",
      "La technologie évolue constamment et de nouveaux langages de programmation émergent chaque année.",
      "La vitesse et la précision sont très importantes dans le processus de développement logiciel et le travail quotidien.",
      "JavaScript est la pierre angulaire des applications web modernes et des frameworks de développement mobile.",
      "Les projets open source contribuent grandement au développement du monde du logiciel et de la communauté.",
      "Les technologies d'intelligence artificielle et d'apprentissage automatique se développent rapidement dans le monde d'aujourd'hui.",
      "L'expérience utilisateur est très importante dans la conception web et les processus de développement d'applications.",
      "La gestion de base de données est l'une des exigences de base des applications et systèmes modernes.",
      "Développer des applications web modernes avec la bibliothèque React est très facile et efficace pour les développeurs.",
      "TypeScript ajoute la sécurité des types à JavaScript et est très utile dans les projets à grande échelle.",
      "Avec Node.js, vous pouvez développer des applications puissantes en utilisant JavaScript côté serveur efficacement.",
      "Créer des designs responsifs avec CSS Grid et Flexbox est maintenant beaucoup plus facile qu'avant.",
      "Le système de contrôle de version Git est une partie indispensable du processus de développement logiciel aujourd'hui.",
      "Les technologies comme les principes RESTful et GraphQL sont largement utilisées dans la conception d'API modernes.",
      "React Native et Flutter sont des choix populaires dans le développement d'applications mobiles multiplateformes.",
      "Le langage de programmation Python est très populaire dans les domaines de la science des données et de l'intelligence artificielle.",
      "L'informatique en nuage a révolutionné la façon dont les entreprises stockent et traitent leurs données dans le monde entier.",
      "Les menaces de cybersécurité deviennent plus sophistiquées et nécessitent des mesures de protection avancées quotidiennement.",
      "Les algorithmes d'apprentissage automatique peuvent analyser de vastes quantités de données pour identifier des modèles et des tendances.",
      "La technologie blockchain offre des solutions décentralisées pour des transactions sécurisées et la vérification de l'intégrité des données."
    ]
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    texts: [
      "Der schnelle braune Fuchs springt über den faulen Hund und läuft durch den Wald.",
      "Die Technologie entwickelt sich ständig weiter und neue Programmiersprachen entstehen jedes Jahr.",
      "Geschwindigkeit und Genauigkeit sind sehr wichtig im Softwareentwicklungsprozess und der täglichen Arbeit.",
      "JavaScript ist der Grundstein moderner Webanwendungen und mobiler Entwicklungsframeworks.",
      "Open-Source-Projekte tragen erheblich zur Entwicklung der Softwarewelt und Gemeinschaft bei.",
      "Künstliche Intelligenz und maschinelle Lerntechnologien entwickeln sich in der heutigen Welt schnell.",
      "Benutzererfahrung ist sehr wichtig im Webdesign und in Anwendungsentwicklungsprozessen.",
      "Datenbankmanagement ist eine der grundlegenden Anforderungen moderner Anwendungen und Systeme.",
      "Die Entwicklung moderner Webanwendungen mit der React-Bibliothek ist sehr einfach und effizient für Entwickler.",
      "TypeScript fügt JavaScript Typsicherheit hinzu und ist sehr nützlich in großen Projekten.",
      "Mit Node.js können Sie leistungsstarke Anwendungen mit JavaScript auf der Serverseite effizient entwickeln.",
      "Das Erstellen responsiver Designs mit CSS Grid und Flexbox ist jetzt viel einfacher als zuvor.",
      "Das Git-Versionskontrollsystem ist heute ein unverzichtbarer Teil des Softwareentwicklungsprozesses.",
      "Technologien wie RESTful-Prinzipien und GraphQL werden umfassend im modernen API-Design verwendet.",
      "React Native und Flutter sind beliebte Wahlmöglichkeiten in der plattformübergreifenden mobilen Anwendungsentwicklung.",
      "Die Programmiersprache Python ist sehr beliebt in den Bereichen Datenwissenschaft und künstliche Intelligenz.",
      "Cloud Computing hat die Art und Weise revolutioniert, wie Unternehmen ihre Daten weltweit speichern und verarbeiten.",
      "Cybersicherheitsbedrohungen werden immer ausgeklügelter und erfordern täglich fortgeschrittene Schutzmaßnahmen.",
      "Maschinelle Lernalgorithmen können große Datenmengen analysieren, um Muster und Trends zu identifizieren.",
      "Blockchain-Technologie bietet dezentrale Lösungen für sichere Transaktionen und Datenintegritätsverifikation."
    ]
  },
  it: {
    code: 'it',
    name: 'Italiano',
    texts: [
      "La volpe marrone veloce salta sopra il cane pigro e corre attraverso la foresta.",
      "La tecnologia è in costante evoluzione e nuovi linguaggi di programmazione emergono ogni anno.",
      "Velocità e precisione sono molto importanti nel processo di sviluppo software e nel lavoro quotidiano.",
      "JavaScript è la pietra angolare delle applicazioni web moderne e dei framework di sviluppo mobile.",
      "I progetti open source contribuiscono notevolmente allo sviluppo del mondo del software e della comunità.",
      "Le tecnologie di intelligenza artificiale e apprendimento automatico si stanno sviluppando rapidamente nel mondo di oggi.",
      "L'esperienza utente è molto importante nel web design e nei processi di sviluppo delle applicazioni.",
      "La gestione del database è uno dei requisiti di base delle applicazioni e sistemi moderni.",
      "Sviluppare applicazioni web moderne con la libreria React è molto facile ed efficiente per gli sviluppatori.",
      "TypeScript aggiunge sicurezza dei tipi a JavaScript ed è molto utile in progetti su larga scala.",
      "Con Node.js puoi sviluppare applicazioni potenti usando JavaScript lato server in modo efficiente.",
      "Creare design responsivi con CSS Grid e Flexbox è ora molto più facile di prima.",
      "Il sistema di controllo versione Git è una parte indispensabile del processo di sviluppo software oggi.",
      "Tecnologie come i principi RESTful e GraphQL sono ampiamente utilizzate nel design di API moderne.",
      "React Native e Flutter sono scelte popolari nello sviluppo di applicazioni mobili multipiattaforma.",
      "Il linguaggio di programmazione Python è molto popolare nei campi della scienza dei dati e dell'intelligenza artificiale.",
      "Il cloud computing ha rivoluzionato il modo in cui le aziende archiviano e elaborano i loro dati in tutto il mondo.",
      "Le minacce alla sicurezza informatica stanno diventando più sofisticate e richiedono misure di protezione avanzate quotidianamente.",
      "Gli algoritmi di apprendimento automatico possono analizzare grandi quantità di dati per identificare modelli e tendenze.",
      "La tecnologia blockchain offre soluzioni decentralizzate per transazioni sicure e verifica dell'integrità dei dati."
    ]
  },
  pt: {
    code: 'pt',
    name: 'Português',
    texts: [
      "A raposa marrom rápida pula sobre o cão preguiçoso e corre pela floresta.",
      "A tecnologia está evoluindo constantemente e novas linguagens de programação surgem a cada ano.",
      "Velocidade e precisão são muito importantes no processo de desenvolvimento de software e trabalho diário.",
      "JavaScript é a pedra angular das aplicações web modernas e frameworks de desenvolvimento móvel.",
      "Projetos de código aberto contribuem enormemente para o desenvolvimento do mundo do software e comunidade.",
      "Tecnologias de inteligência artificial e aprendizado de máquina estão se desenvolvendo rapidamente no mundo de hoje.",
      "A experiência do usuário é muito importante no design web e processos de desenvolvimento de aplicações.",
      "O gerenciamento de banco de dados é um dos requisitos básicos de aplicações e sistemas modernos.",
      "Desenvolver aplicações web modernas com a biblioteca React é muito fácil e eficiente para desenvolvedores.",
      "TypeScript adiciona segurança de tipos ao JavaScript e é muito útil em projetos de grande escala.",
      "Com Node.js você pode desenvolver aplicações poderosas usando JavaScript no lado do servidor eficientemente.",
      "Criar designs responsivos com CSS Grid e Flexbox é agora muito mais fácil do que antes.",
      "O sistema de controle de versão Git é uma parte indispensável do processo de desenvolvimento de software hoje.",
      "Tecnologias como princípios RESTful e GraphQL são amplamente utilizadas no design de API modernas.",
      "React Native e Flutter são escolhas populares no desenvolvimento de aplicações móveis multiplataforma.",
      "A linguagem de programação Python é muito popular nos campos de ciência de dados e inteligência artificial.",
      "A computação em nuvem revolucionou a maneira como as empresas armazenam e processam seus dados mundialmente.",
      "Ameaças de segurança cibernética estão se tornando mais sofisticadas e requerem medidas de proteção avançadas diariamente.",
      "Algoritmos de aprendizado de máquina podem analisar grandes quantidades de dados para identificar padrões e tendências.",
      "A tecnologia blockchain oferece soluções descentralizadas para transações seguras e verificação de integridade de dados."
    ]
  },
  ru: {
    code: 'ru',
    name: 'Русский',
    texts: [
      "Быстрая коричневая лиса прыгает через ленивую собаку и бежит по лесу.",
      "Технологии постоянно развиваются и каждый год появляются новые языки программирования.",
      "Скорость и точность очень важны в процессе разработки программного обеспечения и ежедневной работе.",
      "JavaScript является краеугольным камнем современных веб-приложений и фреймворков мобильной разработки.",
      "Проекты с открытым исходным кодом вносят большой вклад в развитие мира программного обеспечения и сообщества.",
      "Технологии искусственного интеллекта и машинного обучения быстро развиваются в современном мире.",
      "Пользовательский опыт очень важен в веб-дизайне и процессах разработки приложений.",
      "Управление базами данных является одним из основных требований современных приложений и систем.",
      "Разработка современных веб-приложений с библиотекой React очень проста и эффективна для разработчиков.",
      "TypeScript добавляет типобезопасность к JavaScript и очень полезен в крупномасштабных проектах.",
      "С Node.js вы можете эффективно разрабатывать мощные приложения, используя JavaScript на стороне сервера.",
      "Создание адаптивных дизайнов с CSS Grid и Flexbox теперь намного проще, чем раньше.",
      "Система контроля версий Git является неотъемлемой частью процесса разработки программного обеспечения сегодня.",
      "Технологии, такие как принципы RESTful и GraphQL, широко используются в современном дизайне API.",
      "React Native и Flutter являются популярными выборами в кроссплатформенной разработке мобильных приложений.",
      "Язык программирования Python очень популярен в областях науки о данных и искусственного интеллекта.",
      "Облачные вычисления революционизировали способ хранения и обработки данных предприятиями по всему миру.",
      "Угрозы кибербезопасности становятся более изощренными и требуют ежедневных передовых мер защиты.",
      "Алгоритмы машинного обучения могут анализировать огромные объемы данных для выявления закономерностей и тенденций.",
      "Технология блокчейн предлагает децентрализованные решения для безопасных транзакций и проверки целостности данных."
    ]
  },
  ja: {
    code: 'ja',
    name: '日本語',
    texts: [
      "素早い茶色のキツネが怠惰な犬を飛び越えて森を駆け抜けます。",
      "テクノロジーは絶えず進化しており、毎年新しいプログラミング言語が登場しています。",
      "ソフトウェア開発プロセスと日常業務において、スピードと正確性は非常に重要です。",
      "JavaScriptは現代のWebアプリケーションとモバイル開発フレームワークの基盤です。",
      "オープンソースプロジェクトは、ソフトウェア世界とコミュニティの発展に大きく貢献しています。",
      "人工知能と機械学習技術は、今日の世界で急速に発展しています。",
      "ユーザーエクスペリエンスは、Webデザインとアプリケーション開発プロセスにおいて非常に重要です。",
      "データベース管理は、現代のアプリケーションとシステムの基本要件の一つです。",
      "Reactライブラリを使用した現代のWebアプリケーションの開発は、開発者にとって非常に簡単で効率的です。",
      "TypeScriptはJavaScriptに型安全性を追加し、大規模プロジェクトで非常に有用です。",
      "Node.jsを使用すると、サーバーサイドでJavaScriptを使用して強力なアプリケーションを効率的に開発できます。",
      "CSS GridとFlexboxを使用したレスポンシブデザインの作成は、以前よりもはるかに簡単になりました。",
      "Gitバージョン管理システムは、今日のソフトウェア開発プロセスの不可欠な部分です。",
      "RESTful原則やGraphQLなどの技術は、現代のAPI設計で広く使用されています。",
      "React NativeとFlutterは、クロスプラットフォームモバイルアプリケーション開発で人気の選択肢です。",
      "Pythonプログラミング言語は、データサイエンスと人工知能の分野で非常に人気があります。",
      "クラウドコンピューティングは、企業が世界中でデータを保存および処理する方法を革命化しました。",
      "サイバーセキュリティの脅威はより洗練されており、日々高度な保護対策が必要です。",
      "機械学習アルゴリズムは、パターンと傾向を特定するために大量のデータを分析できます。",
      "ブロックチェーン技術は、安全な取引とデータ整合性検証のための分散ソリューションを提供します。"
    ]
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerMode, setIsTimerMode] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && startTime && !endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
        
        if (isTimerMode) {
          const remaining = duration * 1000 - elapsed;
          if (remaining <= 0) {
            finishTest();
          } else {
            setTimeLeft(Math.ceil(remaining / 1000));
          }
        }
      }, 100);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, startTime, endTime, duration, isTimerMode]);

  useEffect(() => {
    if (currentPage === 'test') {
      generateNewText();
    }
  }, [currentPage, difficulty, language]);

  const generateLongText = (): string => {
    const currentLanguage = languages[language];
    const texts = currentLanguage.texts;
    let longText = '';
    
    for (let i = 0; i < 16; i++) {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      longText += randomText + ' ';
    }
    
    return longText.trim();
  };

  const generateNewText = (): void => {
    let newText = generateLongText();
    
    if (!isTimerMode) {
      const maxLength = difficultyLevels[difficulty].textLength;
      if (newText.length > maxLength) {
        const words = newText.split(' ');
        let result = '';
        
        for (const word of words) {
          if ((result + ' ' + word).length <= maxLength) {
            result += (result ? ' ' : '') + word;
          } else {
            break;
          }
        }
        
        newText = result || newText.substring(0, maxLength);
      }
    }
    
    setCurrentText(newText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(100);
    setElapsedTime(0);
    setTimeLeft(duration);
  };

  const calculateWPM = (timeElapsed: number, wordsTyped: number): number => {
    const timeInMinutes = timeElapsed / 60000;
    return timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
  };

  const finishTest = (): void => {
    const now = Date.now();
    setEndTime(now);
    setIsActive(false);
    
    const totalTime = now - startTime!;
    const wordsTyped = userInput.split(' ').length;
    const calculatedWpm = calculateWPM(totalTime, wordsTyped);
    setWpm(calculatedWpm);

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      }
    }
    const finalAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    setAccuracy(finalAccuracy);

    const testResult: TestResult = {
      wpm: calculatedWpm,
      accuracy: finalAccuracy,
      time: (totalTime / 1000).toFixed(1),
      difficulty: difficulty,
      language: language,
      duration: isTimerMode ? duration : 0,
      date: new Date().toLocaleDateString('en-US')
    };
    setTestHistory(prev => [testResult, ...prev.slice(0, 9)]);
  };
  const handleKeyPress = (e: KeyboardEvent): void => {
    if (currentPage !== 'test' || endTime) return;
    
    e.preventDefault();
    
    if (e.key === 'Escape') {
      resetTest();
      return;
    }
    
    if (e.key === 'Backspace') {
      if (userInput.length > 0) {
        const newValue = userInput.slice(0, -1);
        setUserInput(newValue);
        setCurrentIndex(newValue.length);
        
        let correctChars = 0;
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] === currentText[i]) {
            correctChars++;
          }
        }
        const accuracyPercent = newValue.length > 0 ? (correctChars / newValue.length) * 100 : 100;
        setAccuracy(Math.round(accuracyPercent));
      }
      return;
    }
    
    if (e.key.length === 1) {
      const newValue = userInput + e.key;
      
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        setIsActive(true);
      }

      setUserInput(newValue);
      setCurrentIndex(newValue.length);

      let correctChars = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] === currentText[i]) {
          correctChars++;
        }
      }
      const accuracyPercent = newValue.length > 0 ? (correctChars / newValue.length) * 100 : 100;
      setAccuracy(Math.round(accuracyPercent));

      if (!isTimerMode && newValue === currentText) {
        finishTest();
      } else if (startTime) {
        const currentTime = Date.now() - startTime;
        const wordsTyped = newValue.split(' ').length;
        const currentWpm = calculateWPM(currentTime, wordsTyped);
        setWpm(currentWpm);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, userInput, currentText, startTime, endTime, isTimerMode]);

  const resetTest = (): void => {
    generateNewText();
  };

  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = '';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'correct' : 'incorrect';
      } else if (index === currentIndex) {
        className = 'current';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const renderNavbar = () => (
    <nav className="floating-navbar">
      <div className="nav-brand">
        <span>TypeSpeed</span>
      </div>
      <div className="nav-links">
        <button 
          className={currentPage === 'home' ? 'active' : ''} 
          onClick={() => setCurrentPage('home')}
        >
          Home
        </button>
        <button 
          className={currentPage === 'test' ? 'active' : ''} 
          onClick={() => setCurrentPage('test')}
        >
          Test
        </button>
        <button 
          className={currentPage === 'stats' ? 'active' : ''} 
          onClick={() => setCurrentPage('stats')}
        >
          Statistics
        </button>
        <button 
          className={currentPage === 'settings' ? 'active' : ''} 
          onClick={() => setCurrentPage('settings')}
        >
          Settings
        </button>
      </div>
    </nav>
  );
  const renderHomePage = () => (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to TypeSpeed</h1>
        <p>Test and improve your typing speed with our modern typing test application</p>
        <button 
          onClick={() => setCurrentPage('test')} 
          className="start-test-btn"
        >
          Start Typing Test
        </button>
      </div>
    </div>
  );

  const renderTestPage = () => (
    <div className="test-page">
      <div className="test-header">
        <h2>Typing Speed Test</h2>
        
        <div className="test-options">
          <div className="option-group">
            <label>Duration:</label>
            <div className="duration-selector">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  className={duration === dur.value && isTimerMode ? 'active' : ''}
                  onClick={() => {
                    setDuration(dur.value);
                    setTimeLeft(dur.value);
                    setIsTimerMode(true);
                  }}
                >
                  {dur.label}
                </button>
              ))}
              <button
                className={!isTimerMode ? 'active' : ''}
                onClick={() => setIsTimerMode(false)}
              >
                Free
              </button>
            </div>
          </div>

          <div className="option-group">
            <label>Language:</label>
            <div className="language-selector">
              {Object.values(languages).map((lang) => (
                <button
                  key={lang.code}
                  className={language === lang.code ? 'active' : ''}
                  onClick={() => setLanguage(lang.code)}
                >
                  <span className="flag"></span>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {!isTimerMode && (
            <div className="option-group">
              <label>Difficulty:</label>
              <div className="difficulty-selector">
                {Object.entries(difficultyLevels).map(([key, level]) => (
                  <button
                    key={key}
                    className={difficulty === key ? 'active' : ''}
                    onClick={() => setDifficulty(key)}
                  >
                    {level.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{wpm} WPM</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">{isTimerMode ? 'Time Left' : 'Time Elapsed'}</span>
          <span className="stat-value">
            {isTimerMode ? `${timeLeft}s` : `${(elapsedTime / 1000).toFixed(1)}s`}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span className="stat-value">
            {!isActive && !endTime && 'Ready'}
            {isActive && 'Typing...'}
            {endTime && 'Completed!'}
          </span>
        </div>
      </div>

      <div className="text-display">
        {renderText()}
      </div>

      <div className="controls">
        <button onClick={resetTest} className="reset-btn">
          New Test (ESC)
        </button>
      </div>

      {endTime && (
        <div className="results-modal">
          <div className="results-content">
            <h2>Test Completed!</h2>
            <div className="result-stats">
              <div className="result-item">
                <span className="stat-label">Speed</span>
                <span className="stat-value">{wpm} WPM</span>
              </div>
              <div className="result-item">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{accuracy}%</span>
              </div>
              <div className="result-item">
                <span className="stat-label">Time</span>
                <span className="stat-value">
                  {isTimerMode ? `${duration}s` : `${((endTime - startTime!) / 1000).toFixed(1)}s`}
                </span>
              </div>
            </div>
            <button onClick={resetTest} className="try-again-btn">
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
  const renderStatsPage = () => (
    <div className="stats-page">
      <h2>İstatistikleriniz</h2>
      {testHistory.length === 0 ? (
        <div className="no-stats">
          <p>Henüz test geçmişiniz bulunmuyor</p>
          <button onClick={() => setCurrentPage('test')} className="start-test-btn">
            İlk Testinizi Yapın
          </button>
        </div>
      ) : (
        <div className="stats-content">
          <div className="stats-summary">
            <div className="summary-card">
              <h3>Ortalama Hız</h3>
              <span className="summary-value">
                {Math.round(testHistory.reduce((sum, test) => sum + test.wpm, 0) / testHistory.length)} WPM
              </span>
            </div>
            <div className="summary-card">
              <h3>Ortalama Doğruluk</h3>
              <span className="summary-value">
                {Math.round(testHistory.reduce((sum, test) => sum + test.accuracy, 0) / testHistory.length)}%
              </span>
            </div>
            <div className="summary-card">
              <h3>Toplam Test</h3>
              <span className="summary-value">{testHistory.length}</span>
            </div>
          </div>
          
          <div className="history-table">
            <h3>Son Testler</h3>
            <div className="table-header">
              <span>Tarih</span>
              <span>Hız</span>
              <span>Doğruluk</span>
              <span>Süre</span>
              <span>Dil</span>
              <span>Mod</span>
            </div>
            {testHistory.map((test, index) => (
              <div key={index} className="table-row">
                <span>{test.date}</span>
                <span>{test.wpm} WPM</span>
                <span>{test.accuracy}%</span>
                <span>{test.time}s</span>
                <span>{languages[test.language].name}</span>
                <span>{test.duration > 0 ? `${test.duration}s` : 'Serbest'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSettingsPage = () => (
    <div className="settings-page">
      <h2>Ayarlar</h2>
      <div className="settings-content">
        <div className="setting-group">
          <h3>Varsayılan Dil</h3>
          <div className="language-options">
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                className={language === lang.code ? 'active' : ''}
                onClick={() => setLanguage(lang.code)}
              >
                <span className="flag"></span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Varsayılan Süre</h3>
          <div className="duration-options">
            {durations.map((dur) => (
              <button
                key={dur.value}
                className={duration === dur.value ? 'active' : ''}
                onClick={() => setDuration(dur.value)}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Varsayılan Zorluk</h3>
          <div className="difficulty-options">
            {Object.entries(difficultyLevels).map(([key, level]) => (
              <button
                key={key}
                className={difficulty === key ? 'active' : ''}
                onClick={() => setDifficulty(key)}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <h3>Veri</h3>
          <button 
            className="clear-data-btn"
            onClick={() => setTestHistory([])}
          >
            Test Geçmişini Temizle
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {renderNavbar()}
      
      <main className="main-content">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'test' && renderTestPage()}
        {currentPage === 'stats' && renderStatsPage()}
        {currentPage === 'settings' && renderSettingsPage()}
      </main>
    </div>
  );
}

export default App;
