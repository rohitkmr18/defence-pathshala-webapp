#!/usr/bin/env python3
"""Build AFCAT Full Mock 01 (v1 draft) from the DP AFCAT Practice Bank.

Source: "AFCAT Practice Bank - 300 Original Questions" (Claude Doc, rev 3, 3 Nov 2026).
That doc actually contains 225 questions: Section A (GA, 75), Section B (English, 90),
Section C (Numerical, 60). Its Reasoning section was never written, so the 25
reasoning items below (R01-R25) are newly authored for this mock.

Everything here is DRAFT and needs independent review before import or publication.
Run: python3 scripts/build-afcat-mock01.py
"""
import collections, hashlib, json, pathlib, re, sys

OUT = pathlib.Path(__file__).resolve().parent.parent / "content/afcat/prelaunch/full_mock_01_v1.json"
BANK = "DP AFCAT Practice Bank v0 (Claude Doc 'AFCAT Practice Bank - 300 Original Questions', rev 3, 2026-11-03)"

def q(section, topic, sub, diff, ref, text, opts, ans, expl, passage=None):
    return dict(section=section, topic=topic, subtopic=sub, difficulty=diff, ref=ref,
                text=text, options=opts, correct_option=ans, explanation=expl, passage=passage)

GA, EN, NA, RM = "GENERAL_AWARENESS", "ENGLISH", "NUMERICAL_ABILITY", "REASONING_MILITARY_APTITUDE"

# ---------------- Section 1: General Awareness (25) ----------------
ga = [
 q(GA,"History","Modern India - British administration","EASY","A-Q11","The Doctrine of Lapse was introduced by:",["Lord Wellesley","Lord Cornwallis","Lord Dalhousie","Lord Bentinck"],"C","Lord Dalhousie (Governor-General 1848-56) used the Doctrine of Lapse to annex states such as Satara, Jhansi and Nagpur."),
 q(GA,"History","Modern India - reform movements","EASY","A-Q4","The Mohammedan Anglo-Oriental College, Aligarh, was founded by:",["Annie Besant","Syed Ahmad Khan","Dadabhai Naoroji","M. G. Ranade"],"B","Sir Syed Ahmad Khan founded the MAO College in 1875; it later became Aligarh Muslim University."),
 q(GA,"History","Ancient India - Harappan sites","MODERATE","A-Q8","The Harappan site Lothal is in:",["Rajasthan","Haryana","Punjab","Gujarat"],"D","Lothal, known for its dockyard, is in Ahmedabad district, Gujarat."),
 q(GA,"Geography","Indian physical geography","MODERATE","A-Q15","The Tropic of Cancer passes through how many Indian states?",["6","7","9","8"],"D","Eight: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram."),
 q(GA,"Geography","Himalayan peaks","MODERATE","A-Q16","The highest peak lying entirely within India is:",["Kanchenjunga","Nanda Devi","Kamet","Saltoro Kangri"],"B","Kanchenjunga is higher but lies on the India-Nepal border; Nanda Devi (7,816 m) is the highest wholly within India."),
 q(GA,"Geography","Oceanography","EASY","A-Q24","Long, narrow and very deep depressions on the ocean floor are called:",["Abyssal plains","Mid-ocean ridges","Continental shelves","Oceanic trenches"],"D","Oceanic trenches form at subduction zones; the Mariana Trench is the deepest."),
 q(GA,"Polity","Constitutional amendments","EASY","A-Q27","Fundamental Duties were added to the Constitution by the:",["24th Amendment","42nd Amendment","44th Amendment","52nd Amendment"],"B","The 42nd Amendment (1976) inserted Part IV-A (Article 51A) on Fundamental Duties."),
 q(GA,"Polity","Elections and parties","HARD","A-Q32","Recognition of national parties is governed by the:",["Representation of the People Act, 1950 only","Article 368","Election Symbols (Reservation and Allotment) Order, 1968","Tenth Schedule"],"C","The Election Commission recognises national and state parties under paragraph 6 of the Election Symbols Order, 1968."),
 q(GA,"Polity","Sources of the Constitution","EASY","A-Q30","Directive Principles of State Policy were borrowed from the Constitution of:",["Ireland","USA","UK","Canada"],"A","The DPSP (Part IV) were modelled on the Irish Constitution."),
 q(GA,"Science and Technology","Physics - circular motion","EASY","A-Q42","The inward force that keeps a body moving in a circle is:",["Centripetal force","Centrifugal force","Friction","Gravity"],"A","Centripetal force acts towards the centre of the circular path; centrifugal force is an apparent force in the rotating frame."),
 q(GA,"Science and Technology","Chemistry - acids and bases","EASY","A-Q46","The pH of pure water at 25 °C is:",["0","14","7","1"],"C","Pure water is neutral; at 25 °C [H+] = 10^-7 mol/L, so pH = 7."),
 q(GA,"Science and Technology","Biology - blood groups","EASY","A-Q50","The universal red-cell donor blood group is:",["AB+","O−","A−","B+"],"B","O-negative red cells carry no A, B or Rh(D) antigens, so they can be given to recipients of any group in emergencies."),
 q(GA,"Science and Technology","Physics - optics","EASY","A-Q52","Myopia (short-sightedness) is corrected using a:",["Convex lens","Cylindrical lens","Bifocal lens","Concave lens"],"D","In myopia the image forms in front of the retina; a diverging (concave) lens moves it back onto the retina."),
 q(GA,"Environment","Atmosphere","EASY","A-Q23","The ozone layer lies in the:",["Troposphere","Mesosphere","Stratosphere","Exosphere"],"C","Most atmospheric ozone is in the stratosphere, roughly 15-35 km above the surface."),
 q(GA,"Environment","Important days","EASY","A-Q74","World Environment Day is observed on:",["22 April","22 March","5 June","16 September"],"C","5 June (UNEP). 22 April is Earth Day, 22 March World Water Day, 16 September World Ozone Day."),
 q(GA,"Economy","Monetary policy","MODERATE","A-Q38","The repo rate is the rate at which:",["Banks keep deposits with RBI","RBI borrows from banks","Banks lend to the public","Commercial banks borrow short-term from the RBI"],"D","Repo is the rate at which the RBI lends short-term funds to commercial banks against government securities."),
 q(GA,"Economy","Financial institutions","HARD","A-Q36","IDBI (Industrial Development Bank of India) was established in:",["1949","1955","1964","1969"],"C","IDBI was set up in 1964 as a subsidiary of the RBI to finance industrial development."),
 q(GA,"Sports, Awards and Culture","National sports awards","EASY","A-Q69","The Dronacharya Award is conferred on:",["Outstanding sportspersons","Outstanding coaches","Sports journalists","Umpires"],"B","The Dronacharya Award honours coaches whose trainees excel in international events."),
 q(GA,"Sports, Awards and Culture","Dance and theatre","MODERATE","A-Q70","Yakshagana is a traditional dance-drama of:",["Kerala","Andhra Pradesh","Karnataka","Tamil Nadu"],"C","Yakshagana is associated with coastal Karnataka."),
 q(GA,"Sports, Awards and Culture","Sports rules","MODERATE","A-Q71","Under standard rules, how many players of the chasing team are on the field at a time in Kho Kho?",["9","11","7","12"],"A","Nine chasers take the field: eight sit in the squares and one is the active chaser."),
 q(GA,"Defence and Aviation","Operations","MODERATE","A-Q53","Operation Safed Sagar (1999) was the code name for the:",["Army's ground offensive in Kargil","Navy's blockade of Karachi","IAF's air operations in the Kargil conflict","Evacuation of Indians from Ukraine"],"C","Safed Sagar was the IAF's air campaign in Kargil; the Army's operation was Operation Vijay and the Navy's Operation Talwar."),
 q(GA,"Defence and Aviation","Gallantry awards","MODERATE","A-Q57","The only IAF officer to receive the Param Vir Chakra is:",["Flying Officer Nirmal Jit Singh Sekhon","Sqn Ldr Ajjamada Devayya","Wg Cdr Rakesh Sharma","Gp Capt Varun Singh"],"A","Fg Offr N. J. S. Sekhon was awarded the PVC posthumously for defending Srinagar airfield in December 1971."),
 q(GA,"Defence and Aviation","Indigenous weapons","MODERATE","A-Q58","The Rudram series of air-to-surface anti-radiation missiles was developed by:",["HAL","DRDO","BEL","ISRO"],"B","Rudram was developed by DRDO for IAF fighters to destroy enemy radar emitters."),
 q(GA,"Current Affairs","Defence exercises","MODERATE","A-Q66","Tarang Shakti, a multinational air exercise first held in 2024, is organised by the:",["Indian Navy","Indian Army","NSG","Indian Air Force"],"D","Tarang Shakti is the IAF's first multinational air exercise hosted in India (2024). Recheck for later editions before release.",),
 q(GA,"Current Affairs","Naval capability","EASY","A-Q62","India's first indigenously built aircraft carrier, commissioned in 2022, is:",["INS Viraat","INS Vikramaditya","INS Vikrant","INS Vishal"],"C","INS Vikrant (IAC-1), built by Cochin Shipyard, was commissioned in September 2022."),
]

# ---------------- Section 2: Verbal Ability in English (30) ----------------
P1 = ("Air power has transformed modern warfare. Unlike armies, which must cross terrain, an air force can strike at depth "
      "within hours and shift its effort from one theatre to another with little delay. Yet air power alone rarely wins a war. "
      "Its true strength lies in partnership with land and naval forces, where it provides surveillance, transport and precision fire. "
      "Moreover, technology has made pilots dependent on a vast network of engineers, technicians and controllers on the ground. "
      "A single sortie is therefore the visible tip of an enormous, disciplined effort.")
EP = "Identify the part of the sentence that contains an error. Choose (D) if there is no error. "
en = [
 q(EN,"Reading Comprehension","Main idea","MODERATE","B-Q81","The main idea of the passage is that:",["Air power alone wins wars","Air power is powerful but depends on joint effort and a large support network","Armies are obsolete","Pilots are not important"],"B","The passage praises air power's reach but stresses partnership with other forces and a ground support network.",P1),
 q(EN,"Reading Comprehension","Inference","EASY","B-Q82","According to the passage, an air force can 'strike at depth' because it can:",["depend on armies","need no support","reach distant targets within hours","operate only at night"],"C","The passage contrasts armies crossing terrain with air forces striking at depth within hours.",P1),
 q(EN,"Reading Comprehension","Figurative meaning","MODERATE","B-Q83","'The visible tip of an enormous effort' suggests that:",["a sortie is the seen part of a large unseen effort","sorties are easy","engineers are unnecessary","pilots work alone"],"A","Like the tip of an iceberg, the sortie is what is seen; the ground effort behind it is not.",P1),
 q(EN,"Reading Comprehension","Author's view","MODERATE","B-Q84","The author's view of air power acting alone is that it:",["is always decisive","is rarely decisive","is useless","is cheaper than armies"],"B","'Yet air power alone rarely wins a war.'",P1),
 q(EN,"Reading Comprehension","Vocabulary in context","EASY","B-Q85","The word most nearly OPPOSITE in meaning to 'enormous', as used in the passage, is:",["Tiny","Vast","Huge","Massive"],"A","Enormous means very large; tiny is its opposite. The other three are synonyms.",P1),
 q(EN,"Error Detection","Subject-verb agreement","MODERATE","B-Q50",EP+"(A) Neither of the two answers / (B) are correct / (C) according to the key. / (D) No error",["Neither of the two answers","are correct","according to the key.","No error"],"B","'Neither of' takes a singular verb: 'Neither of the two answers is correct.'"),
 q(EN,"Error Detection","Stative verbs","MODERATE","B-Q53",EP+"(A) I have been working here / (B) for five years but / (C) I am knowing the manager well. / (D) No error",["I have been working here","for five years but","I am knowing the manager well.","No error"],"C","'Know' is a stative verb and is not used in the continuous form: 'I know the manager well.'"),
 q(EN,"Error Detection","Conditionals","MODERATE","B-Q56",EP+"(A) If I would have known / (B) the truth, I would have / (C) acted differently. / (D) No error",["If I would have known","the truth, I would have","acted differently.","No error"],"A","A third conditional uses the past perfect in the if-clause: 'If I had known…'"),
 q(EN,"Error Detection","Subject-verb agreement","MODERATE","B-Q57",EP+"(A) The pilot along with / (B) his crew were rescued / (C) by the villagers. / (D) No error",["The pilot along with","his crew were rescued","by the villagers.","No error"],"B","The verb agrees with the first subject ('The pilot'); 'along with his crew' does not make it plural: 'was rescued'."),
 q(EN,"Error Detection","Relative clauses","HARD","B-Q58",EP+"(A) She is one of the best teachers / (B) who has ever taught / (C) in this school. / (D) No error",["She is one of the best teachers","who has ever taught","in this school.","No error"],"B","'Who' refers to 'teachers' (plural), so the verb is plural: 'who have ever taught'."),
 q(EN,"Sentence Completion","Prepositions","EASY","B-Q61","He was accused ____ stealing the money.",["for","of","with","on"],"B","The fixed preposition is 'accused of'."),
 q(EN,"Sentence Completion","Conditionals","MODERATE","B-Q65","Had I known, I ____ helped you.",["will have","would have","would","had"],"B","Inverted third conditional: 'Had I known, I would have helped you.'"),
 q(EN,"Sentence Completion","Vocabulary","EASY","B-Q66","The twins are so alike that it is hard to ____ one from the other.",["distinguish","extinguish","disguise","discourage"],"A","'Distinguish one from the other' means to tell them apart."),
 q(EN,"Sentence Completion","Subject-verb agreement","MODERATE","B-Q68","Neither Ravi nor his friends ____ present.",["was","is","were","has been"],"C","With 'neither…nor', the verb agrees with the nearer subject ('friends'), so 'were'."),
 q(EN,"Sentence Improvement","Double negatives","MODERATE","B-Q72","Choose the best replacement for the part in quotes: She 'doesn't hardly visit' us now.",["not hardly visits","did hardly visit","hardly visits","No improvement"],"C","'Hardly' is already negative; 'doesn't hardly' is a double negative."),
 q(EN,"Sentence Improvement","Tenses","MODERATE","B-Q74","Choose the best replacement for the part in quotes: I 'am waiting' for him since morning.",["was waiting","had waited","will wait","have been waiting"],"D","An action that began in the past and continues now, with 'since', takes the present perfect continuous."),
 q(EN,"Synonyms","Vocabulary","EASY","B-Q1","Choose the word closest in meaning to PRECARIOUS:",["Secure","Steady","Uncertain","Strong"],"C","Precarious means dangerously uncertain or unstable."),
 q(EN,"Synonyms","Vocabulary","MODERATE","B-Q3","Choose the word closest in meaning to BELLIGERENT:",["Hostile","Peaceful","Gentle","Timid"],"A","Belligerent means aggressive or eager to fight."),
 q(EN,"Synonyms","Vocabulary","EASY","B-Q9","Choose the word closest in meaning to PRAGMATIC:",["Idealistic","Practical","Dreamy","Rigid"],"B","Pragmatic means dealing with things sensibly and practically."),
 q(EN,"Synonyms","Vocabulary","HARD","B-Q12","Choose the word closest in meaning to MOUNTEBANK:",["Mountaineer","Charlatan","Banker","Magistrate"],"B","A mountebank is a person who deceives others, a charlatan or quack."),
 q(EN,"Antonyms","Vocabulary","EASY","B-Q13","Choose the word most nearly OPPOSITE in meaning to INTRINSIC:",["Innate","Essential","Extrinsic","Basic"],"C","Intrinsic means belonging naturally; extrinsic means coming from outside."),
 q(EN,"Antonyms","Vocabulary","EASY","B-Q15","Choose the word most nearly OPPOSITE in meaning to FRUGAL:",["Thrifty","Economical","Extravagant","Careful"],"C","Frugal means sparing with money; extravagant means spending excessively."),
 q(EN,"Antonyms","Vocabulary","EASY","B-Q24","Choose the word most nearly OPPOSITE in meaning to VAGUE:",["Hazy","Precise","Obscure","Dim"],"B","Vague means unclear; precise is its opposite."),
 q(EN,"Idioms and Phrases","Meaning","MODERATE","B-Q37","Choose the meaning of the idiom: To break a butterfly on the wheel",["To use excessive force on a trivial matter","To harm a delicate creature accidentally","To fail at an easy task","To waste time"],"A","It means to spend disproportionate force or effort on something unimportant."),
 q(EN,"Idioms and Phrases","Meaning","EASY","B-Q40","Choose the meaning of the idiom: To bite the bullet",["To face a painful situation bravely","To avoid trouble","To eat quickly","To shoot wildly"],"A","To bite the bullet is to accept something unpleasant with courage."),
 q(EN,"Idioms and Phrases","Meaning","MODERATE","B-Q43","Choose the meaning of the idiom: To cut the Gordian knot",["To solve a hard problem by a bold stroke","To tie a knot","To end a friendship","To cut a rope"],"A","From Alexander's legendary cutting of the Gordian knot: a bold, direct solution to an intricate problem."),
 q(EN,"One-Word Substitution","Vocabulary","MODERATE","B-Q27","Choose the one word for: A harsh, discordant mixture of sounds",["Euphony","Harmony","Cacophony","Symphony"],"C","Cacophony is a harsh mixture of sounds; euphony is its opposite."),
 q(EN,"One-Word Substitution","Vocabulary","HARD","B-Q29","Choose the one word for: The belief that only one's own mind is certain to exist",["Solipsism","Altruism","Stoicism","Nihilism"],"A","Solipsism holds that only one's own mind is sure to exist."),
 q(EN,"Sentence Rearrangement","Logical sequence","MODERATE","B-Q77","Arrange P, Q, R, S in a logical order. P: The pilot signalled the tower. Q: A warning light flashed on the console. R: The aircraft landed safely. S: He was asked to divert to the nearest airfield.",["PQSR","QPSR","QSPR","SQPR"],"B","Warning light (Q), pilot signals tower (P), told to divert (S), lands safely (R)."),
 q(EN,"Sentence Rearrangement","Logical sequence","HARD","B-Q78","Arrange P, Q, R, S in a logical order. P: Hence they prefer routine drills. Q: Discipline is the backbone of any force. R: Without it, chaos would follow. S: Commanders understand this well.",["SQRP","QSRP","RQSP","QRSP"],"D","Claim (Q), consequence of its absence (R), commanders know it (S), hence drills (P)."),
]

# ---------------- Section 3: Numerical Ability (20) ----------------
na = [
 q(NA,"Percentages and Ratios","Successive change","MODERATE","C-Q8","A price rises by 25% and then falls by 20%. The net change is:",["5% increase","5% decrease","No change","10% increase"],"C","1.25 × 0.80 = 1.00, so there is no net change."),
 q(NA,"Percentages and Ratios","Successive discounts","MODERATE","C-Q11","Two successive discounts of 10% and 20% equal a single discount of:",["30%","28%","25%","32%"],"B","1 − 0.9 × 0.8 = 0.28, i.e. 28%."),
 q(NA,"Percentages and Ratios","Population growth","MODERATE","C-Q14","A town of 20,000 grows 10% a year. Its population after 2 years is:",["24,000","24,200","24,400","22,000"],"B","20,000 × 1.1² = 24,200."),
 q(NA,"Percentages and Ratios","Compound ratio","MODERATE","C-Q20","If a : b = 2 : 3 and b : c = 4 : 5, then a : c is:",["2 : 5","8 : 15","6 : 5","4 : 5"],"B","a : b : c = 8 : 12 : 15, so a : c = 8 : 15."),
 q(NA,"Time, Work and Distance","Pipes and cisterns","MODERATE","C-Q23","Pipe A fills a tank in 20 minutes and pipe B empties it in 30 minutes. With both open, the tank fills in:",["60 min","50 min","40 min","45 min"],"A","1/20 − 1/30 = 1/60, so 60 minutes."),
 q(NA,"Time, Work and Distance","Trains","MODERATE","C-Q27","A 150 m train running at 54 km/h crosses a pole in:",["8 s","12 s","9 s","10 s"],"D","54 km/h = 15 m/s; 150 ÷ 15 = 10 s."),
 q(NA,"Time, Work and Distance","Average speed","MODERATE","C-Q28","A man covers half a distance at 40 km/h and the rest at 60 km/h. His average speed is:",["50 km/h","48 km/h","52 km/h","45 km/h"],"B","For equal distances, average = 2 × 40 × 60 ÷ (40 + 60) = 48 km/h."),
 q(NA,"Time, Work and Distance","Boats and streams","EASY","C-Q29","A boat goes 12 km/h in still water and the river flows at 3 km/h. The distance covered downstream in 4 hours is:",["36 km","48 km","60 km","72 km"],"C","Downstream speed = 15 km/h; 15 × 4 = 60 km."),
 q(NA,"Profit, Loss and Interest","Loss","EASY","C-Q10","An item sold for ₹540 gives a 10% loss. Its cost price is:",["₹600","₹580","₹594","₹560"],"A","CP = 540 ÷ 0.9 = ₹600."),
 q(NA,"Profit, Loss and Interest","Compound interest","MODERATE","C-Q33","Compound interest on ₹10,000 at 10% per annum for 2 years is:",["₹2,000","₹2,100","₹2,200","₹2,050"],"B","10,000 × (1.21 − 1) = ₹2,100."),
 q(NA,"Profit, Loss and Interest","Simple interest","EASY","C-Q34","A sum doubles in 5 years at simple interest. The rate per annum is:",["10%","15%","25%","20%"],"D","Interest equal to the principal in 5 years means 100% ÷ 5 = 20% a year."),
 q(NA,"Number System and Series","Remainders","MODERATE","C-Q4","The remainder when 2^10 is divided by 7 is:",["1","2","4","3"],"B","2³ = 8 ≡ 1 (mod 7), so 2^10 = (2³)³ × 2 ≡ 2."),
 q(NA,"Number System and Series","Number series","EASY","C-Q59","The next term of the series 2, 6, 12, 20, 30, … is:",["40","42","44","48"],"B","Terms are n(n + 1): the next is 6 × 7 = 42."),
 q(NA,"Fractions and Averages","Averages","EASY","C-Q16","The average of five numbers is 18. If the number 10 is removed, the average of the rest is:",["20","19","22","16"],"A","Total 90; (90 − 10) ÷ 4 = 20."),
 q(NA,"Fractions and Averages","Averages","MODERATE","C-Q18","The average of the first 9 odd natural numbers is:",["8","9","10","11"],"B","The sum of the first n odd numbers is n² = 81; 81 ÷ 9 = 9."),
 q(NA,"Mensuration","Cylinder","EASY","C-Q42","The volume of a cylinder with radius 7 cm and height 10 cm is (take π = 22/7):",["1,540 cm³","770 cm³","3,080 cm³","154 cm³"],"A","(22/7) × 49 × 10 = 1,540 cm³."),
 q(NA,"Mensuration","Cone","EASY","C-Q45","The slant height of a cone with radius 3 cm and height 4 cm is:",["5 cm","7 cm","6 cm","4.5 cm"],"A","√(3² + 4²) = 5 cm."),
 q(NA,"Probability and Statistics","Cards","MODERATE","C-Q53","The probability of drawing a red king from a standard 52-card deck is:",["1/13","1/52","1/26","1/4"],"C","There are two red kings: 2/52 = 1/26."),
 q(NA,"Probability and Statistics","Coins","EASY","C-Q55","Two fair coins are tossed. The probability of at least one head is:",["1/4","1/2","3/4","1"],"C","1 − P(no head) = 1 − 1/4 = 3/4."),
 q(NA,"Mixture and Alligation","Mixtures","MODERATE","C-Q19","A 40-litre mixture has milk and water in the ratio 3 : 1. How much water must be added to make the ratio 3 : 2?",["5 L","10 L","15 L","20 L"],"B","Milk 30 L, water 10 L. For 3 : 2 water must be 20 L, so add 10 L."),
]

# ---------------- Section 4: Reasoning and Military Aptitude (25) - newly authored ----------------
NEW = "NEW-AUTHORED (bank had no reasoning section)"
rm = [
 q(RM,"Verbal Reasoning","Analogy","EASY","R01","Hangar : Aircraft :: Garage : ?",["Road","Driver","Fuel","Car"],"D","An aircraft is housed in a hangar; a car is housed in a garage."),
 q(RM,"Verbal Reasoning","Number analogy","EASY","R02","4 : 64 :: 7 : ?",["343","49","21","147"],"A","64 = 4³, so the answer is 7³ = 343."),
 q(RM,"Verbal Reasoning","Letter analogy","EASY","R03","ACE : BDF :: GIK : ?",["HIJ","JLN","GHI","HJL"],"D","Each letter moves forward by one: G→H, I→J, K→L."),
 q(RM,"Verbal Reasoning","Classification","EASY","R04","Find the odd one out:",["Rafale","Tejas","Chinook","Su-30MKI"],"C","Chinook is a transport helicopter; the others are fighter aircraft."),
 q(RM,"Verbal Reasoning","Classification","MODERATE","R05","Find the odd one out:",["121","169","289","225"],"D","121, 169 and 289 are squares of primes (11, 13, 17); 225 is the square of 15, which is not prime."),
 q(RM,"Verbal Reasoning","Classification","MODERATE","R06","Find the odd one out:",["UWZ","BDF","KMO","PRT"],"A","BDF, KMO and PRT each skip one letter (+2, +2); in UWZ the second step is +3."),
 q(RM,"Verbal Reasoning","Coding-decoding","EASY","R07","If AIR is coded as BJS, how is FORCE coded?",["GPSEF","HQTEG","GQSDF","GPSDF"],"D","Each letter is shifted forward by one: F→G, O→P, R→S, C→D, E→F."),
 q(RM,"Verbal Reasoning","Coding-decoding","EASY","R08","If WING is coded as GNIW, how is TAIL coded?",["LAIT","LIAT","TIAL","ILAT"],"B","The word is written in reverse: TAIL → LIAT."),
 q(RM,"Verbal Reasoning","Coding-decoding","MODERATE","R09","If CAT = 24 because C = 3, A = 1 and T = 20, what is DOG?",["24","27","28","26"],"D","D (4) + O (15) + G (7) = 26."),
 q(RM,"Patterns and Sequences","Number series","EASY","R10","Find the next term: 3, 7, 15, 31, 63, ?",["127","125","126","128"],"A","Each term is double the previous plus 1: 63 × 2 + 1 = 127."),
 q(RM,"Patterns and Sequences","Number series","EASY","R11","Find the next term: 2, 5, 10, 17, 26, ?",["35","36","38","37"],"D","Terms are n² + 1 for n = 1…5; next is 6² + 1 = 37."),
 q(RM,"Patterns and Sequences","Letter series","MODERATE","R12","Find the next letter: B, E, I, N, ?",["S","U","T","R"],"C","Gaps are +3, +4, +5, +6: N (14) + 6 = T (20)."),
 q(RM,"Verbal Reasoning","Directions","MODERATE","R13","A man walks 5 km north, turns right and walks 3 km, then turns right again and walks 9 km. How far and in which direction is he from his starting point?",["5 km North-East","7 km South","4 km South-West","5 km South-East"],"D","He ends 3 km east and 4 km south of the start: √(3² + 4²) = 5 km, to the south-east."),
 q(RM,"Verbal Reasoning","Directions","MODERATE","R14","A cadet facing North turns 90° clockwise, then 180° anticlockwise, then 45° clockwise. Which direction does he now face?",["North-West","North-East","South-West","South-East"],"A","North → East (90° clockwise) → West (180° anticlockwise) → North-West (45° clockwise)."),
 q(RM,"Verbal Reasoning","Blood relations","MODERATE","R15","Pointing to a boy, Ravi (a man) says, 'He is the son of my father's only daughter.' How is the boy related to Ravi?",["Son","Brother","Cousin","Nephew"],"D","Ravi's father's only daughter is Ravi's sister; her son is Ravi's nephew."),
 q(RM,"Verbal Reasoning","Blood relations","EASY","R16","A is B's sister. C is B's mother. D is C's father. How is A related to D?",["Daughter","Niece","Granddaughter","Grandmother"],"C","A is C's daughter, and C is D's daughter, so A is D's granddaughter."),
 q(RM,"Verbal Reasoning","Syllogism","MODERATE","R17","Statements: All pilots are officers. Some officers are engineers. Conclusions: I. Some pilots are engineers. II. Some engineers are officers.",["Only II follows","Only I follows","Both I and II follow","Neither follows"],"A","II is the converse of 'some officers are engineers'. I does not follow: the officers who are engineers need not be pilots."),
 q(RM,"Verbal Reasoning","Syllogism","HARD","R18","Statements: All aircraft are machines. No machine is alive. Conclusions: I. No aircraft is alive. II. Some machines are aircraft.",["Only I follows","Only II follows","Neither follows","Both I and II follow"],"D","I follows because aircraft fall inside machines, which exclude living things. II follows by converting 'All aircraft are machines'."),
 q(RM,"Verbal Reasoning","Ranking","EASY","R19","In a row of 40 cadets, Arjun is 12th from the left. What is his position from the right?",["28th","29th","30th","27th"],"B","40 − 12 + 1 = 29."),
 q(RM,"Verbal Reasoning","Calendar","MODERATE","R20","If 1 January 2025 was a Wednesday, what day of the week was 1 January 2026?",["Wednesday","Friday","Tuesday","Thursday"],"D","2025 is not a leap year, so 365 days = 52 weeks + 1 day: Wednesday + 1 = Thursday."),
 q(RM,"Verbal Reasoning","Seating arrangement","MODERATE","R21","Five cadets P, Q, R, S and T sit in a row facing north. R is in the middle. P is at the left end. Q is immediately to the right of P. T is not at either end. Who is at the right end?",["S","Q","T","R"],"A","Order from left: P, Q, R, then T (not at an end) and S. S is at the right end."),
 q(RM,"Spatial Reasoning","Clock mirror image","MODERATE","R22","A clock shows 3:40. What time will its mirror image show?",["9:20","7:20","8:20","8:40"],"C","Mirror time = 11:60 − 3:40 = 8:20."),
 q(RM,"Patterns and Sequences","Missing number","MODERATE","R23","Find the missing number. Row 1: 3, 4, 12. Row 2: 5, 6, 30. Row 3: 7, 2, ?",["9","12","16","14"],"D","The third number in each row is the product of the first two: 7 × 2 = 14."),
 q(RM,"Spatial Reasoning","Mirror image","MODERATE","R24","Which letter looks unchanged when reflected in a mirror placed vertically beside it?",["A","F","R","N"],"A","A is symmetric about its vertical axis; F, R and N are not."),
 q(RM,"Verbal Reasoning","Dictionary order","HARD","R25","Arrange in dictionary order: 1. Sortie 2. Sorting 3. Sorrow 4. Sort",["4, 3, 1, 2","4, 1, 2, 3","3, 4, 2, 1","3, 4, 1, 2"],"D","Sorrow (sorr- before sort-), Sort (a prefix of the others), Sortie (e before n), Sorting."),
]

def norm(s):
    return re.sub(r"\s+", " ", s.strip().lower())

items = ga + en + na + rm
assert [len(ga), len(en), len(na), len(rm)] == [25, 30, 20, 25], "section counts"
questions, seen = [], set()
for i, it in enumerate(items, 1):
    opts = it["options"]
    assert len(opts) == 4 and len({norm(o) for o in opts}) == 4, f"options Q{i}"
    assert it["correct_option"] in "ABCD"
    fp_src = norm((it["passage"] or "") + "|" + it["text"] + "|" + "|".join(opts))
    fp = hashlib.sha256(fp_src.encode()).hexdigest()
    assert fp not in seen, f"duplicate Q{i}"; seen.add(fp)
    new = it["ref"].startswith("R")
    stem = {"text": it["text"]}
    if it["passage"]:
        stem.update(passage_id="FM01-P1", passage=it["passage"])
    questions.append({
        "external_id": f"AFCAT-FM01-CAND-V1-{i:03d}",
        "position": i,
        "pool_type": "FULL_MOCK",
        "section": it["section"],
        "topic": it["topic"],
        "subtopic": it["subtopic"],
        "stem": stem,
        "options": [{"key": k, "text": t} for k, t in zip("ABCD", opts)],
        "correct_option": it["correct_option"],
        "explanation": {"text": it["explanation"]},
        "difficulty": it["difficulty"],
        "source_kind": "ORIGINAL",
        "source_reference": (NEW if new else f"{BANK}, Section {it['ref']}"),
        "source_rights_status": "REVIEW_REQUIRED",
        "fingerprint_sha256": fp,
        "content_version": 1,
        "editorial_status": "DRAFT",
        "requires_independent_review": True,
    })

sec = collections.Counter(x["section"] for x in questions)
keys = collections.Counter(x["correct_option"] for x in questions)
diff = collections.Counter(x["difficulty"] for x in questions)
pkg = {
    "package": "AFCAT_FM01_V1_DRAFT",
    "status": "DRAFT_DO_NOT_PUBLISH",
    "built_by": "scripts/build-afcat-mock01.py",
    "source": BANK,
    "notes": [
        "Replaces full_mock_01_candidates_v0.json (20 unverified drafts, removed on founder instruction 2026-11-04).",
        "Items 1-75 are selected from the practice bank; items 76-100 (reasoning) are newly authored because the bank has no reasoning section.",
        "All items are DP-original practice questions written to the AFCAT pattern. None is an official or memory-reconstructed AFCAT paper question.",
        "Section order follows the AFCAT paper: GA, English, Numerical, Reasoning. 25/30/20/25 is DP's split, not an official IAF allocation.",
        "Reasoning is text-only: no figure-based non-verbal items yet, unlike the real paper.",
        "Difficulty labels are author estimates, not calibrated.",
    ],
    "exam_config": {"question_count": 100, "duration_seconds": 7200, "correct_marks": 3,
                    "incorrect_marks": -1, "unanswered_marks": 0, "max_marks": 300, "language": "en"},
    "summary": {"sections": dict(sec), "answer_keys": dict(sorted(keys.items())),
                "difficulty": dict(sorted(diff.items()))},
    "questions": questions,
}
OUT.write_text(json.dumps(pkg, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(pkg["summary"]), file=sys.stderr)
print(OUT)
