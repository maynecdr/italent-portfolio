'use strict';

const output = document.getElementById('output');
const cmdline = document.getElementById('cmdline');
const promptEl = document.getElementById('prompt');
const helpPane = document.getElementById('helpPane');
const terminalShell = document.getElementById('terminalShell');
const doomOverlay = document.getElementById('doomOverlay');
let doomTimer = null;

const FASTFETCH_LOGO = [
  '              @@@@@@@@@@@@',
  '          @@@@@@@@@@@@@@@@@@@@',
  '       @@@@@@@@@@@@@@@@@@@@@@@@@@',
  '     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  ' @@@*.......@.....@@@@........@@@@@@@@@',
  ' @@@*        @     @     @    @@@@@@@@@@',
  '@@@@*    @    @@  @    @@@    @@@@@@@@@@',
  '@@@@*    @      @@    @@@@    @@@@@@@@@@',
  '@@@@*          @.      @@@    @@@@@@@@@@',
  '@@@@*   #@@@@@@    +    @@    @@@@@@@@@@',
  ' @@@*   #@@@@@    @@@    @.         @@@@',
  ' @@@*   #@@@@    @@@@@    @@        @@@',
  '  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
  '       @@@@@@@@@@@@@@@@@@@@@@@@@@',
  '          @@@@@@@@@@@@@@@@@@@@',
  '              @@@@@@@@@@@@',
].join('\n');

const FASTFETCH_INFO = [
  'user        : anatolii (tolik)',
  'uptime      : 22 years',
  'origin      : Odesa, UA → Belgium',
  'role        : student + intern',
  'school      : PBA Toegepaste Informatica, PXL-Digital',
  'intern_at   : Black Talon NV',
  'focus       : network security, cloud infra',
  'stack       : Linux, Cloudflare, Terraform, Docker',
  'interests   : gaming, metal, photography, security events',
  'good_at     : networks, infra design, hands-on learning',
  'working_on  : Cloud Security University (Cloudflare demo env)',
  'improving   : professional communication, assertiveness',
].join('\n');

const HELP_TEXT = [
  'PXL I-Talent Portfolio – Safonov Anatolii',
  '',
  'Login:',
  '  username : anatolii',
  '  password : pxlstudent',
  '',
  'Commands:',
  '  ls             list directory',
  '  cd <dir>       enter directory',
  '  cd ..          go up one level',
  '  pwd            current path',
  '  cat <file>     read file',
  '  tree           show full file tree',
  '  fastfetch      quick profile overview',
  '  doom           retro mode',
  '  help           this help text',
  '  clear          clear screen',
  '',
  'Navigation:',
  '  ArrowUp/Down   command history',
  '  Tab            autocomplete',
  '',
  'Filesystem:',
  '  /',
  '  ├── about/',
  '  │   ├── me.txt',
  '  │   ├── skills.txt',
  '  │   └── goals.txt',
  '  ├── activities/',
  '  │   ├── seminaries/',
  '  │   │   ├── 2025-2026.txt',
  '  │   │   └── 2024-2025.txt',
  '  │   ├── innovation/',
  '  │   │   ├── security_cloud_route.txt',
  '  │   │   └── hackathon_smart_ict.txt',
  '  │   ├── personal_dev/',
  '  │   │   ├── project_week.txt',
  '  │   │   └── pop_sessions.txt',
  '  │   └── international/',
  '  │       └── germany_studytrip.txt',
  '  ├── portfolio/',
  '  │   ├── bsides_limburg.txt',
  '  │   ├── germany_trip.txt',
  '  │   └── innovation_route.txt',
  '  ├── reflection.txt',
  '  └── .help',
].join('\n');

// ── About ──────────────────────────────────────────────────────────────

const ME_TXT = [
  'Anatolii Safonov – maar iedereen noemt me Tolik.',
  '22 jaar, oorspronkelijk uit Oekraïne, vier jaar in België.',
  'België voelt als thuis.',
  '',
  'Buiten IT: gaming, metalmuziek (een passie die vier jaar geleden',
  'plots begon), en fotografie – als reden om buiten te zijn',
  'met een camera in de hand in plaats van achter een scherm.',
  '',
  'Technisch: sterk in netwerken en cloud security.',
  'Twee jaar student-medewerker bij een ISP: hands-on ervaring',
  'met het opzetten en configureren van netwerkapparatuur.',
  '',
  'Nu: stagiair bij Black Talon NV.',
  'Project: demo-omgeving voor Cloudflare-functionaliteiten',
  '("Cloud Security University").',
  '',
  'Grootste kracht: snel leren door dingen direct uit te proberen.',
  'Werkpunten: assertief communiceren, professioneel Nederlands.',
  '',
  'Opleiding : PBA Toegepaste Informatica – PXL-Digital',
  'Jaar      : 2025-2026',
].join('\n');

const SKILLS_TXT = [
  'Core stack:',
  '  Linux (dagelijks gebruik, homelab)',
  '  Docker / containerisatie',
  '  Terraform / Infrastructure as Code',
  '  Cloudflare (security, networking, zero trust)',
  '',
  'Netwerken & Security:',
  '  SD-WAN configuratie (hands-on, Exclusive Networks)',
  '  VPN tunnels, routing, switching',
  '  Firewall beheer',
  '  Zero trust concepten',
  '  Incident response (simulatie bij Resilix)',
  '  Pentesting basics (Brightest, Toreon)',
  '  OT security (theoretisch, BSides Limburg)',
  '',
  'Cloud:',
  '  Azure (networking, security)',
  '  Multi-cloud workflows',
  '  IaC deployment',
  '',
  'DevOps:',
  '  CI/CD pipelines met security scanning (DevSecOps – Gluo)',
  '',
  'Overig:',
  '  Digitale forensics (basis)',
  '  Professionele communicatie in incident scenario\'s',
].join('\n');

const GOALS_TXT = [
  'Geen vijfjarenplannen. Wat ik wel wil:',
  '',
  'Professioneel:',
  '  Goede job in cloud of security in België',
  '  Werken bij een bedrijf dat security serieus neemt',
  '  Professioneel Nederlands verder verbeteren',
  '  Assertiever communiceren in groepscontexten',
  '',
  'Technisch:',
  '  Cloudflare zero trust architectuur verder verdiepen',
  '  OT/ICS security (interesse gewekt bij BSides Limburg)',
  '  Cloud-native security tools',
  '',
  'Persoonlijk:',
  '  Meer buiten zijn',
  '  Meer evenementen bijwonen',
  '  Camera bovenhalen',
  '  Mensen opzoeken',
].join('\n');

// ── Activities / Seminaries ────────────────────────────────────────────

const SEMINARIES_2526 = [
  'Seminaries 2025-2026',
  '====================',
  '',
  '[1]  Brightest – Pentesting',
  '     5 november 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Inleiding tot pentesting: basisconcepten van offensieve beveiliging.',
  '',
  '[2]  Secwise – Cybersecurity & Identity',
  '     12 november 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Moderne identiteitsverificatie en de shift naar zero trust.',
  '',
  '[3]  Gluo – DevSecOps',
  '     3 december 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Hands-on labo: security integreren in een CI/CD-pipeline.',
  '     Scanners toevoegen, kwetsbaarheden oplossen in een testomgeving.',
  '     Ons team eindigde als tweede.',
  '',
  '[4]  Cegeka – Bezoek datacenter',
  '     10 december 2025  |  ~3u  |  Cegeka, Hasselt',
  '     Rondleiding datacenter: infrastructuur, koeling, fysieke beveiliging.',
  '     Netter dan andere datacenters die ik eerder gezien heb.',
].join('\n');

const SEMINARIES_2425 = [
  'Seminaries 2024-2025',
  '====================',
  '',
  '[1]  Gluo – Multi-cloud',
  '     4 maart 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Infrastructure as Code en multi-cloud workflow deployments.',
  '',
  '[2]  Toreon – Ethical Hacking',
  '     11 maart 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Bug bounty hunting en kwetsbaarheden in webservices.',
  '',
  '[3]  Politie – Digitaal forensisch onderzoek',
  '     1 april 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Digitale forensics, cybercrime en data recovery zonder wijziging.',
  '',
  '[4]  Cegeka – Azure Networking',
  '     22 april 2025  |  ~3u  |  Corda Campus, PXL-Digital',
  '     Veilige en schaalbare netwerken bouwen in Azure.',
  '',
  '[extra]  BSides Limburg – Cybersecurity conferentie',
  '         vrijdag 13 december 2024  |  ~8u  |  Corda Campus, Hasselt',
  '         Community-gedreven beveiligingsconferentie.',
  '         Bijgewoond als intern van Black Talon NV.',
  '         → zie /portfolio/bsides_limburg.txt voor volledige reflectie',
].join('\n');

// ── Activities / Innovation ────────────────────────────────────────────

const INNOVATION_SECURITY = [
  'Innovatieroute Security & Cloud',
  '================================',
  'Datum   : 2–9 oktober 2025  |  25u',
  'Locatie : Exclusive Networks & Resilix, Corda Campus',
  '',
  'DAG 1 – Secure SD-WAN (Exclusive Networks)',
  '  Hands-on configuratie van SD-WAN firewalls en routers.',
  '  VPN-tunnels opzetten en gedistribueerd netwerk beheren',
  '  vanuit een centrale console.',
  '',
  'DAG 2 – Security incident drill (Resilix)',
  '  Simulatie van een ransomware-incident.',
  '  Als team: intern rapporteren, extern communiceren',
  '  naar klanten, pers en autoriteiten.',
  '  Hendrik sprak bewust geen Engels – extra uitdaging voor Nederlands.',
  '',
  '→ zie /portfolio/innovation_route.txt voor volledige reflectie',
].join('\n');

const INNOVATION_HACKATHON = [
  'Hackathon Smart ICT',
  '====================',
  'Datum   : 16–17 februari 2026  |  25u',
  'Locatie : Corda Campus',
  'Partner : Smart ICT (PXL Research)',
  '',
  'Tweedaagse hackathon.',
  'Opdracht: AI-functie ontwikkelen om profielen aan te vullen',
  'en verhalen te genereren op basis van gestandaardiseerde input.',
  'Thema lag me persoonlijk niet bijzonder – opdracht afgerond als team.',
].join('\n');

// ── Activities / Personal development ─────────────────────────────────

const PERSONAL_PROJECT_WEEK = [
  'Projectweek 2TIN',
  '=================',
  'Datum   : februari 2025  |  5 werkdagen, 27u',
  'Locatie : PXL-Digital, Corda Campus',
  '',
  'Week vol sessies rond persoonlijke ontwikkeling,',
  'teambuilding en start van het Research Project.',
].join('\n');

const PERSONAL_POP = [
  'POP-sessies',
  '============',
  '',
  '[1]  Brein aan het werk! Niet storen! (2TIN)',
  '     18 februari 2025  |  2u  |  Corda Campus',
  '     Impact van digitalisering op focus en concentratie.',
  '     Bewust omgaan met je digitale leven.',
  '',
  '[2]  POPping (2TIN)',
  '     24 maart 2025  |  2u  |  PXL',
  '     Eigen vaardigheden leren kennen.',
  '     Feedback geven en ontvangen in een team.',
  '',
  '[3]  My Team and I (3TIN)',
  '     15 oktober 2025  |  2u  |  Corda Campus',
  '     Teambuildingsessie met de piramide van Lencioni.',
  '     Bevestigd: teambuilding buiten schoolverband werkt beter.',
].join('\n');

// ── Activities / International ─────────────────────────────────────────

const INTERNATIONAL_GERMANY = [
  'Studiereis Duitsland',
  '=====================',
  'Datum  : april/mei 2026  |  5 dagen',
  'Route  : Bielefeld – Detmold – Hannover – Maagdenburg – Berlijn',
  '',
  'DAG 1  Hochschule Bielefeld',
  '   Bezoek aan Duits instituut vergelijkbaar met PXL.',
  '   Vergelijking curriculum en studieaanpak.',
  '',
  'DAG 2  Nacht in Detmold',
  '   Kleine stad. Andere sfeer. Charmant.',
  '',
  'DAG 3  Hannover Messe',
  '   Gigantische industriebeurs: automatisering en technologie.',
  '   Overweldigend, maar de schaal alleen al is iets om te zien.',
  '',
  'DAG 4  Maagdenburg',
  '   Rustpunt.',
  '   Beste burger van mijn leven in een willekeurige kroeg.',
  '',
  'DAG 5  Berlijn – Chaos Computer Club (CCC)',
  '   Talks over digitale soevereiniteit en massasurveillance.',
  '   Onderwerpen die ik persoonlijk sterk herken.',
  '',
  'DAG 6  Berlijn – Vrije dag',
  '   Wandeling door Oost-Berlijn met een vriend uit Oekraïne.',
  '   Simpel, geen agenda. Een van de beste dagen van het jaar.',
  '',
  '→ zie /portfolio/germany_trip.txt voor volledige reflectie',
].join('\n');

// ── Portfolio / Selected activities ───────────────────────────────────

const PORTFOLIO_BSIDES = [
  'BSides Limburg – Cybersecurity Conferentie',
  '=============================================',
  'Vrijdag 13 december 2024  |  ~8u  |  Corda Campus, Hasselt',
  '',
  'OMSCHRIJVING',
  '',
  'BSides Limburg is een jaarlijkse, community-gedreven cybersecurity-',
  'conferentie op de Corda Campus in Hasselt. Het evenement brengt',
  'security professionals, onderzoekers en studenten samen rond een',
  'breed spectrum van talks en demonstraties.',
  'Bijgewoond als intern van Black Talon NV – deels via het bedrijf,',
  'deels op eigen initiatief. Mijn tweede keer op het evenement.',
  '',
  'KERN',
  '',
  'Keynote – Cyber Defense: Russische cyberdreigingen',
  '  Actoren, aanvalsvectoren, civiele infrastructuur als doelwit.',
  '  Voor mij geen nieuwe informatie – ik of iemand die ik ken heeft',
  '  die aanvallen meegemaakt. Maar goed dat West-Europeanen het volgen.',
  '',
  'Talk – Privacy',
  '  Onnodig data verzamelen, slecht retentiebeleid, dark patterns.',
  '  Privacyproblemen zijn niet enkel technisch – ook design-gedreven.',
  '  Het voorbeeld van een auto die je slaapschema bijhoudt bleef me bij.',
  '',
  'Talk – OT Security  [persoonlijk hoogtepunt]',
  '  Legacy hardware zonder encryptie, uptime boven veiligheid.',
  '  Uitdaging: robuuste perimeter bouwen + detectie voor abnormaal',
  '  verkeer, zonder de OT-omgeving zelf diepgaand te kennen.',
  '  Een 20 jaar oude legacy switch kan laggen na één enkele ping.',
  '  Full black box pentest is simpelweg niet mogelijk.',
  '',
  'Talk – Browser Exploitation (ex-PXL-student)',
  '  Kwetsbaarheid in het Chromium Embedded Framework:',
  '  elk bestand op een systeem kunnen downloaden.',
  '  Privé GitHub-repos stelen door een gebruiker de enter-toets',
  '  ingedrukt te laten houden. Subtiel, creatief, goed gedemonstreerd.',
  '',
  'Talk – Azure Hacking',
  '  Privilege escalation en blootgestelde APIs.',
  '  Live demo mislukte door technische problemen. Hoort erbij.',
  '',
  'REFLECTIE',
  '',
  'Wat BSides uniek maakt tegenover standaard seminaries op school:',
  'de sfeer en het publiek. Geen verplichte aanwezigheid – een zaal',
  'vol mensen die er bewust voor kiezen. Compleet andere energie.',
  '',
  'De OT-talk bevestigde: goede security is ook context. Je kan niet',
  'zomaar moderne tools toepassen op legacy omgevingen. Begrijp de',
  'systemen, ken hun limieten, dan pas een strategie bouwen. Dat sluit',
  'aan bij hoe ik zelf werk: eerst begrijpen, dan oplossen.',
  '',
  'Als intern van Black Talon voelde ik me voor het eerst echt',
  'onderdeel van de bredere securitygemeenschap in België.',
  'Mijn reflectie werd nadien door het bedrijf gedeeld op LinkedIn.',
  '',
  'X-Factor: (em)passie, internationalisering, samen(net)werken.',
].join('\n');

const PORTFOLIO_GERMANY = [
  'Studiereis naar Duitsland: Bielefeld, Hannover, Berlijn',
  '========================================================',
  'april/mei 2026  |  5 dagen',
  '',
  'OMSCHRIJVING',
  '',
  'Een vijfdaagse studiereis via PXL-Digital: Hochschule Bielefeld,',
  'Detmold, Hannover Messe, Maagdenburg, Berlijn.',
  'Hoogtepunt: bezoek aan de Chaos Computer Club (CCC).',
  '',
  'KERN',
  '',
  'Hochschule Bielefeld',
  '  Duits instituut vergelijkbaar met PXL.',
  '  Interessant om curriculum-overlappingen en verschillen te zien.',
  '',
  'Detmold',
  '  Kleine stad. Heel andere sfeer. Charmant.',
  '',
  'Hannover Messe',
  '  Gigantische industriebeurs: automatisering en technologie.',
  '  Overweldigend voor studenten zonder jobbeurs-agenda.',
  '  Maar de schaal alleen al is iets om te zien.',
  '',
  'Maagdenburg',
  '  Rustpunt. Beste burger die ik ooit at in een willekeurige kroeg.',
  '',
  'Berlijn – Dag 1: Chaos Computer Club',
  '  Talks over digitale soevereiniteit en massasurveillance.',
  '  Onderwerpen die ik persoonlijk sterk herken, gezien mijn achtergrond.',
  '',
  'Berlijn – Dag 2: Vrije dag',
  '  Wandeling door Oost-Berlijn met een vriend uit Oekraïne, nu in Saksen.',
  '  Simpel. Geen agenda. Een van de meest betekenisvolle dagen van het jaar.',
  '',
  'REFLECTIE',
  '',
  'Deze reis was meer dan een schooluitstap. Het was de eerste keer in',
  'vier jaar dat ik echt het gevoel had te "leven" in plaats van enkel',
  'te studeren. De voorbije jaren: school, werk, overleven in een nieuw',
  'land. Dat was nodig – maar ik was vergeten dat er meer is.',
  '',
  'Wat veranderde is moeilijk toe te schrijven aan één moment.',
  'Het was de combinatie: nieuwe steden, onbekende mensen, het weerzien',
  'van een vriend, de CCC, de burger in Maagdenburg, de wandeling.',
  'Al die kleine dingen samen zorgden voor verbinding – met andere',
  'mensen, met de wereld, met mezelf buiten de IT-bubbel.',
  '',
  'De CCC sloot inhoudelijk aan bij mijn professionele interesses.',
  'Security is niet alleen technisch – het is ook maatschappelijk.',
  'Die manier van denken wil ik meenemen in hoe ik mijn carrière vorm.',
  '',
  'Ik kom terug met één concreet voornemen: meer buiten zijn,',
  'meer mensen opzoeken, meer evenementen bijwonen.',
  'Niet als verplichting – omdat ik het wil.',
  '',
  'X-Factor: (internationaal) samen(net)werken, (em)passie.',
].join('\n');

const PORTFOLIO_INNOVATION = [
  'Innovatieroute Security & Cloud',
  '================================',
  '2–9 oktober 2025  |  25u  |  Exclusive Networks & Resilix',
  '',
  'OMSCHRIJVING',
  '',
  'Tweedaagse deep-dive georganiseerd via PXL-Digital.',
  'Dag 1: hands-on SD-WAN configuratie bij Exclusive Networks.',
  'Dag 2: gesimuleerde security incident drill bij Resilix.',
  '',
  'KERN',
  '',
  'Dag 1 – Secure SD-WAN (Exclusive Networks)',
  '  Praktische introductie tot Secure SD-WAN.',
  '  Firewalls en routers configureren, VPN-tunnels opzetten,',
  '  gedistribueerd netwerk beheren vanuit een centrale console.',
  '  Voor mij bekend terrein vanuit ISP-tijd – nu in enterprise-context.',
  '',
  'Dag 2 – Security Incident Drill (Resilix)',
  '  Ransomware-incident gesimuleerd.',
  '  Als team: intern rapporteren, extern communiceren.',
  '  Wanneer ben je verplicht een lek te melden?',
  '  Hoe formuleer je eerlijk zonder paniek te zaaien?',
  '  Hoe houd je interne communicatielijnen open?',
  '  Extra uitdaging: Hendrik sprak bewust geen Engels.',
  '  Ik moest een crisis managen in mijn derde taal.',
  '',
  'REFLECTIE',
  '',
  'De activiteit die me het sterkst confronteerde met het verschil',
  'tussen technische kennis en professioneel handelen.',
  '',
  'Ik heb de netwerktechnische achtergrond voor SD-WAN.',
  'De incident drill toonde de andere laag: de menselijke,',
  'communicatieve kant van security.',
  '',
  'In het echte leven kies je niet in welke taal je een crisis managt.',
  'Ik denk dat ik me redelijk goed heb geslagen – maar het was ook',
  'een duidelijk signaal: professioneel Nederlands verder ontwikkelen.',
  '',
  'Wat ik meeneem: goede security professionals zijn ook goede',
  'communicatoren. Dat werk ik bewust aan.',
  '',
  'X-Factor: ondernemend & innovatief.',
].join('\n');

// ── Final reflection ───────────────────────────────────────────────────

const REFLECTION_TXT = [
  'Eindreflectie',
  '==============',
  '',
  'Drie jaar geleden arriveerde ik in België met een koffer, een',
  'basiskennis IT en een vaag idee van wat ik hier zou gaan doen.',
  'Nu, aan het einde van mijn opleiding, weet ik wie ik ben als',
  'professional en wat ik wil.',
  '',
  'Technisch ben ik sterk gegroeid. Begonnen met netwerkervaringen',
  'uit mijn ISP-tijd, verdiept in de opleiding met cloud, security',
  'en IaC, en nu dagelijks toegepast op stage bij Black Talon.',
  'Maar de grootste groei was niet technisch.',
  '',
  'De voorbije jaren: studeren en overleven in een nieuw land.',
  'Dat had redenen – maar het betekende ook dat ik niet echt leefde.',
  'De studiereis naar Duitsland veranderde iets. Niet door één groot',
  'inzicht, maar door een opeenstapeling van kleine momenten.',
  'Ik wil meer van dat. Meer buiten, meer mensen, meer ervaringen.',
  '',
  'WERKPUNTEN',
  '  Communicatie in de brede zin.',
  '  Nederlands: functioneel maar nog niet vloeiend genoeg voor alle',
  '  professionele situaties. Assertiviteit in groepen.',
  '  Ik werk eraan – elke dag, gewoon door er te zijn en te doen.',
  '',
  'MIJN X-FACTOR',
  '',
  '(Em)passie',
  '  Ik doe dit omdat ik het leuk vind. Security, netwerken, cloud –',
  '  ik lees er buiten school over, ga naar BSides in mijn vrije tijd,',
  '  bouw dingen op mijn homelab. Die passie is echt.',
  '',
  'Ondernemend & innovatief',
  '  Ik wacht niet tot iemand me zegt wat ik moet leren.',
  '  DevSecOps-labo Gluo: ons team eindigde als tweede terwijl',
  '  mijn teamgenoot het moeilijk had – ik pakte het gewoon zelf aan.',
  '  Bij Black Talon: als iets niet werkt, zoek ik de oplossing.',
  '',
  '(Internationaal) samen(net)werken',
  '  Ik ben zelf een internationaal verhaal. Ik studeer in een andere',
  '  taal dan mijn moedertaal, werk bij een Belgisch bedrijf,',
  '  was op BSides, bezocht de CCC. Mijn netwerk groeit.',
  '',
  'Multi- & disciplinariteit',
  '  Van netwerken naar cloud naar security naar communicatie in een',
  '  incident drill – ik beweeg me comfortabel over meerdere domeinen.',
  '  Op stage werk ik niet alleen technisch: ik denk ook na over hoe',
  '  je een product demonstreert en uitlegt.',
  '',
  'TOEKOMST',
  '  Geen vijfjarenplannen.',
  '  Een goede job in cloud of security in België.',
  '  Blijven groeien – de IT-wereld staat nooit stil.',
  '  En dat vind ik eigenlijk geweldig.',
  '',
  '───',
  'Portfolio I-Talent – Safonov Anatolii – 2025-2026',
].join('\n');

// ── rm -rf easter egg ──────────────────────────────────────────────────

const RM_RF_LINES = [
  "rm: removing '/bin/sh'",
  "rm: removing '/bin/bash'",
  "rm: removing '/bin/ls'",
  "rm: removing '/bin/cat'",
  "rm: removing '/bin/kill'",
  "rm: removing '/bin/rm'",
  "rm: removing '/usr/bin/python3'",
  "rm: removing '/usr/bin/sudo'",
  "rm: removing '/usr/bin/vim'",
  "rm: removing '/usr/bin/ssh'",
  "rm: removing '/usr/bin/curl'",
  "rm: removing '/usr/bin/apt'",
  "rm: removing '/usr/bin/gcc'",
  "rm: removing '/usr/bin/make'",
  "rm: removing '/etc/passwd'",
  "rm: removing '/etc/shadow'",
  "rm: removing '/etc/fstab'",
  "rm: removing '/etc/hostname'",
  "rm: removing '/etc/hosts'",
  "rm: removing '/etc/crontab'",
  "rm: removing '/etc/resolv.conf'",
  "rm: removing '/home/anatolii/.bashrc'",
  "rm: removing '/home/anatolii/.profile'",
  "rm: removing '/home/anatolii/.ssh/id_rsa'",
  "rm: removing '/home/anatolii/.ssh/authorized_keys'",
  "rm: removing '/home/anatolii/documents/thesis.pdf'",
  "rm: removing '/home/anatolii/documents/portfolio.zip'",
  "rm: removing '/var/log/auth.log'",
  "rm: removing '/var/log/syslog'",
  "rm: removing '/var/cache/apt/archives'",
  "rm: removing '/lib/x86_64-linux-gnu/libc.so.6'",
  "rm: removing '/lib/x86_64-linux-gnu/libm.so.6'",
  "rm: removing '/lib/x86_64-linux-gnu/libpthread.so.0'",
  "rm: removing '/boot/vmlinuz-6.1.0-25-amd64'",
  "rm: removing '/boot/initrd.img-6.1.0-25-amd64'",
  "rm: removing '/boot/grub/grub.cfg'",
  "rm: removing '/'",
  "Segmentation fault (core dumped)",
];

// ── Filesystem ─────────────────────────────────────────────────────────

const FS = {
  '/': {
    type: 'dir',
    children: {
      'about': {
        type: 'dir',
        children: {
          'me.txt':     { type: 'file', content: ME_TXT },
          'skills.txt': { type: 'file', content: SKILLS_TXT },
          'goals.txt':  { type: 'file', content: GOALS_TXT },
        },
      },
      'activities': {
        type: 'dir',
        children: {
          'seminaries': {
            type: 'dir',
            children: {
              '2025-2026.txt': { type: 'file', content: SEMINARIES_2526 },
              '2024-2025.txt': { type: 'file', content: SEMINARIES_2425 },
            },
          },
          'innovation': {
            type: 'dir',
            children: {
              'security_cloud_route.txt': { type: 'file', content: INNOVATION_SECURITY },
              'hackathon_smart_ict.txt':  { type: 'file', content: INNOVATION_HACKATHON },
            },
          },
          'personal_dev': {
            type: 'dir',
            children: {
              'project_week.txt': { type: 'file', content: PERSONAL_PROJECT_WEEK },
              'pop_sessions.txt': { type: 'file', content: PERSONAL_POP },
            },
          },
          'international': {
            type: 'dir',
            children: {
              'germany_studytrip.txt': { type: 'file', content: INTERNATIONAL_GERMANY },
            },
          },
        },
      },
      'portfolio': {
        type: 'dir',
        children: {
          'bsides_limburg.txt':   { type: 'file', content: PORTFOLIO_BSIDES },
          'germany_trip.txt':     { type: 'file', content: PORTFOLIO_GERMANY },
          'innovation_route.txt': { type: 'file', content: PORTFOLIO_INNOVATION },
        },
      },
      'reflection.txt': { type: 'file', content: REFLECTION_TXT },
      '.help':          { type: 'file', content: HELP_TEXT },
    },
  },
};

// ── State ──────────────────────────────────────────────────────────────

const state = {
  loggedIn: false,
  loginStage: 'username',
  pendingUsername: '',
  username: null,
  cwd: '/',
  history: [],
  historyIndex: null,
  draftInput: '',
};

const COMMANDS = ['ls', 'cd', 'pwd', 'help', 'clear', 'cat', 'tree', 'fastfetch', 'doom'];

// ── Filesystem helpers ─────────────────────────────────────────────────

function getNode(path) {
  if (path === '/') return FS['/'];
  const parts = path.split('/').filter(Boolean);
  let node = FS['/'];
  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

function normalizePath(input) {
  if (!input || input === '.') return state.cwd;
  const parts = input.startsWith('/') ? [] : state.cwd.split('/').filter(Boolean);
  for (const token of input.split('/')) {
    if (!token || token === '.') continue;
    if (token === '..') parts.pop();
    else parts.push(token);
  }
  return '/' + parts.join('/');
}

// ── Output helpers ─────────────────────────────────────────────────────

function appendLine(text, className) {
  const div = document.createElement('div');
  div.className = ('line ' + (className || '')).trim();
  div.textContent = text || '';
  output.appendChild(div);
  followTerminalBottom();
}

function appendHTML(htmlString) {
  const wrapper = document.createElement('div');
  wrapper.className = 'line';
  wrapper.innerHTML = htmlString;
  output.appendChild(wrapper);
  followTerminalBottom();
}

function appendBlock(text, className) {
  String(text).split('\n').forEach(function(line) { appendLine(line, className); });
}

function followTerminalBottom(force) {
  const dist = terminalShell.scrollHeight - terminalShell.clientHeight - terminalShell.scrollTop;
  if (force || dist < 120) {
    requestAnimationFrame(function() {
      terminalShell.scrollTo({ top: terminalShell.scrollHeight, behavior: 'smooth' });
      cmdline.focus({ preventScroll: true });
    });
  }
}

// ── Prompt & help ──────────────────────────────────────────────────────

function renderPrompt() {
  if (!state.loggedIn) {
    promptEl.textContent = state.loginStage === 'username' ? 'login: ' : 'password: ';
    cmdline.type = state.loginStage === 'password' ? 'password' : 'text';
  } else {
    const shownPath = state.cwd === '/' ? '~' : '~' + state.cwd;
    promptEl.textContent = state.username + '@pxl:' + shownPath + '$ ';
    cmdline.type = 'text';
  }
  followTerminalBottom(true);
}

function renderHelp() {
  var ctx = '';
  if (!state.loggedIn) {
    ctx = 'Status: not authenticated\n\nEnter username, then password.';
  } else {
    var cwd = state.cwd;
    if (cwd === '/') {
      ctx = 'Context: /\n\nQuick start:\n  fastfetch           quick profile\n  cat reflection.txt  final reflection\n  tree                full file tree\n  cd about            personal info\n  cd activities       all activities\n  cd portfolio        detailed reflections';
    } else if (cwd === '/about') {
      ctx = 'Context: /about\n\nme.txt     – wie is Tolik\nskills.txt – technische skills\ngoals.txt  – toekomst & doelen\n\ncat <file> to read\ncd ..      to go back';
    } else if (cwd === '/activities') {
      ctx = 'Context: /activities\n\nseminaries/    all seminaries\ninnovation/    innovation route + hackathon\npersonal_dev/  POP + project week\ninternational/ Germany study trip\n\ncd <dir> to enter';
    } else if (cwd === '/activities/seminaries') {
      ctx = 'Context: /activities/seminaries\n\n2025-2026.txt  this year\n2024-2025.txt  last year + BSides\n\ncat <file> to read\ncd ..      to go back';
    } else if (cwd === '/activities/innovation') {
      ctx = 'Context: /activities/innovation\n\nsecurity_cloud_route.txt\nhackathon_smart_ict.txt\n\nFull reflections in /portfolio/';
    } else if (cwd === '/activities/personal_dev') {
      ctx = 'Context: /activities/personal_dev\n\nproject_week.txt\npop_sessions.txt';
    } else if (cwd === '/activities/international') {
      ctx = 'Context: /activities/international\n\ngermany_studytrip.txt\n\nFull reflection:\n/portfolio/germany_trip.txt';
    } else if (cwd === '/portfolio') {
      ctx = 'Context: /portfolio\n\nbsides_limburg.txt\n  BSides conferentie\ngermany_trip.txt\n  studiereis Duitsland\ninnovation_route.txt\n  innovatieroute\n\ncat <file> to read full reflections';
    } else {
      ctx = 'Context: ' + cwd + '\n\nls       list contents\ncat FILE read a file\ncd ..    go up';
    }
  }
  helpPane.textContent = HELP_TEXT + '\n\n------------------------------\n' + ctx;
}

// ── Commands ───────────────────────────────────────────────────────────

function listDirectory() {
  const node = getNode(state.cwd);
  if (!node || node.type !== 'dir') { appendLine('ls: cannot access current directory'); return; }
  const entries = Object.entries(node.children);
  if (!entries.length) { appendLine('(empty)'); return; }
  const parts = entries.map(function(e) {
    if (e[1].type === 'dir') {
      return '<span class="dir-name">' + e[0] + '/</span>';
    }
    return '<span class="file-name">' + e[0] + '</span>';
  });
  appendHTML(parts.join('    '));
}

function changeDirectory(target) {
  const nextPath = normalizePath(target);
  const node = getNode(nextPath);
  if (!node) { appendLine('cd: no such file or directory: ' + target); return; }
  if (node.type !== 'dir') { appendLine('cd: not a directory: ' + target); return; }
  state.cwd = nextPath;
  renderPrompt();
  renderHelp();
}

function readFile(target) {
  if (!target) { appendLine('cat: missing file operand'); return; }
  const path = normalizePath(target);
  const node = getNode(path);
  if (!node) { appendLine('cat: ' + target + ': No such file or directory'); return; }
  if (node.type !== 'file') { appendLine('cat: ' + target + ': Is a directory'); return; }
  appendBlock(node.content);
}

function buildTreeLines(node, prefix) {
  var lines = [];
  var entries = Object.entries(node.children || {});
  entries.forEach(function(entry, idx) {
    var isLast = idx === entries.length - 1;
    var connector = isLast ? '└── ' : '├── ';
    var name = entry[0] + (entry[1].type === 'dir' ? '/' : '');
    lines.push(prefix + connector + name);
    if (entry[1].type === 'dir') {
      var childPrefix = prefix + (isLast ? '    ' : '│   ');
      lines = lines.concat(buildTreeLines(entry[1], childPrefix));
    }
  });
  return lines;
}

function printTree() {
  var node = getNode(state.cwd);
  if (!node || node.type !== 'dir') { appendLine('tree: not a directory'); return; }
  var label = state.cwd === '/' ? '.' : state.cwd.split('/').pop() + '/';
  appendLine(label, 'dir-name');
  buildTreeLines(node, '').forEach(function(line) { appendLine(line); });
}

// ── Autocomplete ───────────────────────────────────────────────────────

function getAutocompleteOptions(input) {
  const parts = input.split(' ').filter(function(p) { return p.length > 0; });
  const isCommandPosition = parts.length === 0 || (parts.length === 1 && !input.endsWith(' '));
  if (isCommandPosition) {
    const prefix = parts[0] || '';
    return COMMANDS.filter(function(c) { return c.indexOf(prefix) === 0; });
  }
  const command = parts[0];
  if (command === 'cd' || command === 'cat') {
    const partial = input.endsWith(' ') ? '' : (parts[parts.length - 1] || '');
    const currentNode = getNode(state.cwd);
    if (!currentNode || currentNode.type !== 'dir') return [];
    let opts = Object.entries(currentNode.children)
      .filter(function(e) { return command !== 'cd' || e[1].type === 'dir'; })
      .map(function(e) { return e[0]; });
    if (command === 'cd' && state.cwd !== '/') opts.push('..');
    return opts.filter(function(o) { return o.indexOf(partial) === 0; });
  }
  return [];
}

function applyAutocomplete() {
  const current = cmdline.value;
  const matches = getAutocompleteOptions(current);
  if (!matches.length) return;
  const parts = current.split(' ').filter(function(p) { return p.length > 0; });
  if (matches.length === 1) {
    const isCmd = parts.length <= 1 && !current.endsWith(' ');
    if (isCmd) { cmdline.value = matches[0] + ' '; }
    else { cmdline.value = parts[0] + ' ' + matches[0] + ' '; }
    return;
  }
  appendLine(matches.join('    '));
  followTerminalBottom();
}

// ── History ────────────────────────────────────────────────────────────

function pushHistory(value) {
  if (!value.trim()) return;
  if (state.history[state.history.length - 1] !== value) state.history.push(value);
  state.historyIndex = null;
  state.draftInput = '';
}

function navigateHistory(direction) {
  if (!state.history.length) return;
  if (state.historyIndex === null) { state.draftInput = cmdline.value; state.historyIndex = state.history.length; }
  state.historyIndex += direction;
  if (state.historyIndex < 0) state.historyIndex = 0;
  if (state.historyIndex > state.history.length) state.historyIndex = state.history.length;
  cmdline.value = state.historyIndex === state.history.length ? state.draftInput : state.history[state.historyIndex];
  requestAnimationFrame(function() { const e = cmdline.value.length; cmdline.setSelectionRange(e, e); });
}

// ── Doom ───────────────────────────────────────────────────────────────

function closeDoom() {
  document.body.classList.remove('doom-launching');
  var game = doomOverlay.querySelector('.doom-game');
  if (game) {
    game.style.opacity = '0';
    setTimeout(function() { game.innerHTML = ''; }, 400);
  }
  var btn = document.getElementById('doomClose');
  if (btn) btn.remove();
  clearTimeout(doomTimer);
  setTimeout(function() { cmdline.focus(); }, 100);
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.body.classList.contains('doom-launching')) {
    closeDoom();
  }
});

function startDoom() {
  var game = doomOverlay.querySelector('.doom-game');
  if (!game) return;
  game.innerHTML = '';
  game.style.opacity = '1';

  var btn = document.createElement('button');
  btn.id = 'doomClose';
  btn.className = 'doom-close';
  btn.textContent = 'click to exit';
  btn.addEventListener('click', closeDoom);
  document.body.appendChild(btn);

  fetch('./doom/chocolate-doom.wasm', { method: 'HEAD' })
    .then(function(r) {
      if (!r.ok) throw new Error(r.status);
      var iframe = document.createElement('iframe');
      iframe.src = './doom/index.html';
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      game.appendChild(iframe);
    })
    .catch(function() {
      game.innerHTML =
        '<div style="font-family:\'Courier New\',monospace;color:#f88;padding:32px;line-height:1.8">' +
        'doom/ assets not found.<br>' +
        '<span style="color:#9a9a9a">run from project root:</span><br>' +
        '<span style="color:#fff">bash doom/download.sh</span><br><br>' +
        '<span style="color:#9a9a9a">~30 MB, one-time download.</span>' +
        '</div>';
    });
}

function launchDoom() {
  appendLine('launching retro mode...');
  appendLine('[press ESC to return to terminal]', 'muted');
  document.body.classList.add('doom-launching');
  clearTimeout(doomTimer);
  doomTimer = setTimeout(startDoom, 1400);
}

// ── rm -rf easter egg ──────────────────────────────────────────────────

function launchRmRf() {
  var rmrfOverlay = document.getElementById('rmrfOverlay');
  var i = 0;
  cmdline.disabled = true;

  function printNext() {
    if (i < RM_RF_LINES.length) {
      var cls = RM_RF_LINES[i].startsWith('Seg') ? 'muted' : '';
      appendLine(RM_RF_LINES[i], cls);
      i++;
      setTimeout(printNext, i < RM_RF_LINES.length - 3 ? 55 : 200);
    } else {
      setTimeout(function() {
        document.body.classList.add('rmrf-active');
        rmrfOverlay.setAttribute('aria-hidden', 'false');

        function dismiss() {
          document.body.classList.remove('rmrf-active');
          rmrfOverlay.setAttribute('aria-hidden', 'true');
          cmdline.disabled = false;
          cmdline.focus();
          document.removeEventListener('keydown', dismiss);
          rmrfOverlay.removeEventListener('click', dismiss);
        }
        document.addEventListener('keydown', dismiss);
        rmrfOverlay.addEventListener('click', dismiss);
      }, 600);
    }
  }
  printNext();
}

// ── Command dispatch ───────────────────────────────────────────────────

function handleLoggedInCommand(raw) {
  var input = raw.trim();
  if (!input) return;
  if (input === 'rm -rf /') { launchRmRf(); return; }
  var parts = input.split(' ');
  var command = parts[0];
  var args = parts.slice(1);
  switch (command) {
    case 'ls': listDirectory(); break;
    case 'cd':
      if (!args[0]) { state.cwd = '/'; renderPrompt(); renderHelp(); }
      else changeDirectory(args[0]);
      break;
    case 'pwd': appendLine(state.cwd); break;
    case 'cat': readFile(args[0]); break;
    case 'tree': printTree(); break;
    case 'fastfetch':
      appendHTML('<div class="fastfetch-block"><pre class="ascii-logo">' + FASTFETCH_LOGO + '</pre></div>');
      appendBlock(FASTFETCH_INFO);
      break;
    case 'help': appendBlock(HELP_TEXT); break;
    case 'clear': output.innerHTML = ''; followTerminalBottom(true); break;
    case 'doom': launchDoom(); break;
    default: appendLine(command + ': command not found'); break;
  }
}

function handleLoginInput(raw) {
  if (state.loginStage === 'username') {
    state.pendingUsername = raw.trim();
    if (!state.pendingUsername) { appendLine('username required'); return; }
    state.loginStage = 'password';
    renderPrompt();
    renderHelp();
    return;
  }
  if (state.pendingUsername === 'anatolii' && raw === 'pxlstudent') {
    state.loggedIn = true;
    state.username = state.pendingUsername;
    appendLine('Authentication successful.');
    appendLine('Type help or tree to explore the portfolio.', 'muted');
  } else {
    appendLine('Login incorrect');
    state.pendingUsername = '';
  }
  state.loginStage = 'username';
  renderPrompt();
  renderHelp();
}

// ── Input events ───────────────────────────────────────────────────────

cmdline.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    var shownValue = cmdline.value;
    var shownPrompt = promptEl.textContent;
    var displayed = cmdline.type === 'password' ? '*'.repeat(shownValue.length) : shownValue;
    appendLine((shownPrompt + displayed).trimEnd(), 'command-echo');
    pushHistory(shownValue);
    if (state.loggedIn) handleLoggedInCommand(shownValue);
    else handleLoginInput(shownValue);
    cmdline.value = '';
    followTerminalBottom(true);
    return;
  }
  if (event.key === 'ArrowUp') { event.preventDefault(); navigateHistory(-1); return; }
  if (event.key === 'ArrowDown') { event.preventDefault(); navigateHistory(1); return; }
  if (event.key === 'Tab') { event.preventDefault(); if (state.loggedIn) applyAutocomplete(); }
});

cmdline.addEventListener('input', function() {
  if (state.historyIndex === null) state.draftInput = cmdline.value;
});

terminalShell.addEventListener('mousedown', function() {
  setTimeout(function() { cmdline.focus({ preventScroll: true }); }, 0);
});

// ── Init ───────────────────────────────────────────────────────────────

appendLine('PXL I-Talent Portfolio – Safonov Anatolii');
appendLine('Use the credentials in the help panel to log in.', 'muted');
renderPrompt();
renderHelp();
followTerminalBottom(true);
