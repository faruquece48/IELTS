import Image from "next/image";
import Navbar from "@/components/Navbar";

const segments = [
  {
    title: "Family Members",
    focus: "Parents, siblings, relatives, grandparents",
    vocab: [
      { phrase: "close-knit family", meaning: "family members have a strong relationship", usage: "I come from a close-knit family, so we spend quite a lot of time together." },
      { phrase: "strong family bond", meaning: "deep connection among family members", usage: "I have a particularly strong family bond with my older brother." },
      { phrase: "look up to someone", meaning: "admire/respect someone", usage: "I've always looked up to my father because of his determination." },
      { phrase: "be there for someone", meaning: "support someone when needed", usage: "My mother has always been there for me, especially during difficult times." },
      { phrase: "supportive", meaning: "gives encouragement/help", usage: "She's incredibly supportive of whatever I decide to pursue." },
      { phrase: "caring", meaning: "shows concern for others", usage: "He's a very caring person who always puts his family first." },
      { phrase: "considerate", meaning: "thinks about other people's feelings", usage: "My sister is extremely considerate and rarely does anything that might upset others." },
      { phrase: "dependable", meaning: "someone you can rely on", usage: "He's one of the most dependable people I know." },
      { phrase: "down-to-earth", meaning: "practical and modest", usage: "Despite being successful, my uncle is very down-to-earth." },
      { phrase: "selfless", meaning: "puts others before oneself", usage: "My mother is remarkably selfless when it comes to her children." },
      { phrase: "protective", meaning: "wants to keep someone safe", usage: "My elder brother can be quite protective of me." },
      { phrase: "set a good example", meaning: "behave in a way others should copy", usage: "My parents have always set a good example for me." },
      { phrase: "instil values in someone", meaning: "teach important values gradually", usage: "My parents instilled a strong work ethic in me from an early age." },
      { phrase: "have a profound influence on", meaning: "greatly influence", usage: "My grandfather had a profound influence on the way I see life." },
      { phrase: "share a lot in common", meaning: "have similar interests/characteristics", usage: "My sister and I have a lot in common, particularly our taste in books." },
      { phrase: "see eye to eye", meaning: "agree with each other", usage: "We don't always see eye to eye, but we respect each other's opinions." },
      { phrase: "generation gap", meaning: "difference between younger/older generations", usage: "Sometimes there's a noticeable generation gap between parents and their children." },
      { phrase: "family-oriented", meaning: "gives great importance to family", usage: "I'm quite family-oriented, so maintaining strong relationships matters to me." },
    ]
  },
  {
    title: "Friends",
    focus: "Close friends, companions, people you enjoy spending time with",
    vocab: [
      { phrase: "get along well with", meaning: "have a good relationship", usage: "I get along really well with him because we have similar personalities." },
      { phrase: "hit it off", meaning: "quickly become friendly", usage: "We hit it off almost immediately when we first met." },
      { phrase: "have a lot in common", meaning: "share interests/opinions", usage: "We have a lot in common, particularly when it comes to music." },
      { phrase: "like-minded", meaning: "having similar opinions/interests", usage: "I enjoy spending time with like-minded people." },
      { phrase: "trustworthy", meaning: "can be trusted", usage: "She's extremely trustworthy, so I can talk to her about almost anything." },
      { phrase: "easy-going", meaning: "relaxed and not easily annoyed", usage: "He's very easy-going, which makes him pleasant to be around." },
      { phrase: "good company", meaning: "enjoyable person to spend time with", usage: "She's always good company, even when we're doing something ordinary." },
      { phrase: "sense of humour", meaning: "ability to make/find things funny", usage: "What I appreciate most is his great sense of humour." },
      { phrase: "confide in someone", meaning: "share private feelings/problems", usage: "He's someone I can confide in whenever I'm going through a difficult time." },
      { phrase: "stand by someone", meaning: "support someone in difficulty", usage: "A genuine friend stands by you when things go wrong." },
      { phrase: "bring out the best in someone", meaning: "make someone behave/perform better", usage: "She somehow brings out the best in me." },
      { phrase: "go back a long way", meaning: "have known each other for many years", usage: "We go back a long way; we've known each other since school." },
      { phrase: "keep in touch", meaning: "maintain communication", usage: "Although we live in different cities, we still keep in touch regularly." },
      { phrase: "drift apart", meaning: "gradually become less close", usage: "Some childhood friends naturally drift apart as they grow older." },
      { phrase: "mutual respect", meaning: "respect shared by both people", usage: "I think strong friendships are based on mutual respect." },
      { phrase: "share a strong bond", meaning: "have a close connection", usage: "We've shared a strong bond for years." },
      { phrase: "be on the same wavelength", meaning: "think similarly", usage: "We're usually on the same wavelength, so conversation comes naturally." },
      { phrase: "reliable", meaning: "can be depended upon", usage: "To me, a good friend should be reliable rather than simply entertaining." },
    ]
  },
  {
    title: "Teachers / Mentors",
    focus: "Teachers, lecturers, coaches, bosses, mentors",
    vocab: [
      { phrase: "knowledgeable", meaning: "knows a great deal", usage: "He was extremely knowledgeable about his subject." },
      { phrase: "approachable", meaning: "easy to talk to", usage: "What made her different was that she was incredibly approachable." },
      { phrase: "inspiring", meaning: "makes people want to improve", usage: "She was one of the most inspiring teachers I've ever had." },
      { phrase: "encouraging", meaning: "gives confidence/support", usage: "He was always encouraging, even when students made mistakes." },
      { phrase: "patient", meaning: "able to tolerate difficulties calmly", usage: "A good teacher needs to be exceptionally patient." },
      { phrase: "dedicated", meaning: "strongly committed", usage: "She was completely dedicated to her students." },
      { phrase: "passionate about", meaning: "strongly interested in", usage: "He was genuinely passionate about teaching." },
      { phrase: "explain something clearly", meaning: "make difficult ideas understandable", usage: "She had a remarkable ability to explain complex concepts clearly." },
      { phrase: "spark someone's interest in", meaning: "cause someone to become interested", usage: "He sparked my interest in science." },
      { phrase: "broaden someone's horizons", meaning: "expand someone's knowledge/views", usage: "Good teachers can broaden students' horizons." },
      { phrase: "motivate someone to", meaning: "encourage action", usage: "She motivated me to work harder and become more disciplined." },
      { phrase: "bring out someone's potential", meaning: "help someone develop abilities", usage: "Great teachers know how to bring out their students' potential." },
      { phrase: "constructive feedback", meaning: "useful criticism/advice", usage: "She always gave us constructive feedback rather than simply pointing out mistakes." },
      { phrase: "make a lasting impression on", meaning: "remain strongly in memory", usage: "He made a lasting impression on me." },
      { phrase: "shape someone's outlook", meaning: "influence how someone thinks", usage: "My school teacher helped shape my outlook on education." },
      { phrase: "serve as a role model", meaning: "be someone others want to copy", usage: "She served as a role model for many of her students." },
      { phrase: "nurture talent", meaning: "help ability develop", usage: "Teachers play an important role in nurturing young talent." },
      { phrase: "instil confidence", meaning: "gradually develop confidence in someone", usage: "A capable teacher can instil confidence in struggling students." },
    ]
  },
  {
    title: "Famous / Successful / Influential People",
    focus: "Celebrities, athletes, business leaders, public figures",
    vocab: [
      { phrase: "highly accomplished", meaning: "very successful", usage: "She's a highly accomplished individual in her field." },
      { phrase: "influential figure", meaning: "person who affects many people", usage: "He's become an influential figure among younger generations." },
      { phrase: "widely recognized", meaning: "known by many people", usage: "She's widely recognized for her contribution to the industry." },
      { phrase: "well-respected", meaning: "admired by others", usage: "He's a well-respected figure in his profession." },
      { phrase: "remarkable achievement", meaning: "impressive success", usage: "Winning the award was a remarkable achievement." },
      { phrase: "rise to prominence", meaning: "become famous/important", usage: "He rose to prominence at a relatively young age." },
      { phrase: "make a name for oneself", meaning: "become famous/successful", usage: "She made a name for herself through hard work and persistence." },
      { phrase: "dedication", meaning: "strong commitment", usage: "What I admire most is his extraordinary dedication." },
      { phrase: "perseverance", meaning: "continuing despite difficulty", usage: "Her success is largely due to her perseverance." },
      { phrase: "resilient", meaning: "recovers from difficulty", usage: "She's remarkably resilient and doesn't give up easily." },
      { phrase: "ambitious", meaning: "strongly wants to succeed", usage: "He's extremely ambitious, but not in an arrogant way." },
      { phrase: "charismatic", meaning: "naturally attracts people", usage: "He's a charismatic speaker who can easily engage an audience." },
      { phrase: "make a significant contribution to", meaning: "contribute importantly", usage: "She has made a significant contribution to education." },
      { phrase: "leave a lasting legacy", meaning: "create an impact that remains", usage: "I think he'll leave a lasting legacy in his profession." },
      { phrase: "overcome adversity", meaning: "succeed despite difficulties", usage: "I admire people who manage to overcome adversity." },
      { phrase: "achieve recognition", meaning: "become acknowledged/respected", usage: "It took her years to achieve international recognition." },
      { phrase: "exceptional work ethic", meaning: "unusually strong commitment to work", usage: "His exceptional work ethic is one reason for his success." },
      { phrase: "command respect", meaning: "naturally receive respect", usage: "His achievements and behaviour command respect." },
    ]
  },
  {
    title: "Helpful / Inspiring People",
    focus: "Someone who helped, advised, or positively influenced you",
    vocab: [
      { phrase: "kind-hearted", meaning: "naturally kind", usage: "She's an incredibly kind-hearted person." },
      { phrase: "compassionate", meaning: "deeply concerned about others", usage: "He has a very compassionate nature." },
      { phrase: "empathetic", meaning: "understands others' feelings", usage: "She's highly empathetic, so people feel comfortable talking to her." },
      { phrase: "generous", meaning: "willing to give/help", usage: "He's extremely generous with his time." },
      { phrase: "selfless", meaning: "puts others first", usage: "Helping others seems almost selfless to him." },
      { phrase: "thoughtful", meaning: "shows consideration", usage: "It was an incredibly thoughtful gesture." },
      { phrase: "lend someone a helping hand", meaning: "help someone", usage: "She's always willing to lend someone a helping hand." },
      { phrase: "go out of one's way to", meaning: "make special effort", usage: "She went out of her way to help me prepare for the exam." },
      { phrase: "offer guidance", meaning: "give useful advice", usage: "He offered me valuable guidance when I needed it most." },
      { phrase: "give someone moral support", meaning: "provide emotional encouragement", usage: "My family gave me tremendous moral support." },
      { phrase: "reassure someone", meaning: "make someone less worried", usage: "She managed to reassure me when I was extremely nervous." },
      { phrase: "boost someone's confidence", meaning: "increase confidence", usage: "His encouragement really boosted my confidence." },
      { phrase: "have a positive impact on", meaning: "affect positively", usage: "She's had a positive impact on both my personal and professional life." },
      { phrase: "make a difference in someone's life", meaning: "positively change someone's life", usage: "Even a little encouragement can make a difference in someone's life." },
      { phrase: "inspire someone to", meaning: "motivate by example", usage: "Her attitude inspired me to become more disciplined." },
      { phrase: "show genuine concern for", meaning: "sincerely care about", usage: "He always shows genuine concern for the people around him." },
      { phrase: "put others before oneself", meaning: "prioritize others", usage: "She frequently puts others before herself." },
      { phrase: "someone I can count on", meaning: "reliable person", usage: "He's definitely someone I can count on whenever I'm in trouble." },
    ]
  }
];

const universalExpressions = [
  "I've always looked up to him/her.",
  "We get along extremely well.",
  "He's someone I can always count on.",
  "What I admire most about him/her is...",
  "He/she has had a profound influence on me.",
  "He/she has played a significant role in my life.",
  "He/she brings out the best in me.",
  "He/she has always been there for me.",
  "One thing that sets him/her apart is...",
  "He/she made a lasting impression on me.",
  "I find his/her personality quite inspiring.",
  "He/she has an exceptional work ethic.",
  "He/she tends to put others before himself/herself.",
  "I've learned a great deal from him/her.",
  "I wouldn't say he/she is perfect, but..."
];

export default function PeoplePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking / Part 2 / People</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">People Sector Vocabulary</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Learn vocabulary by <strong>segments</strong>. The vocabulary for describing a close friend differs from vocabulary for a teacher or influential person.
        </p>

        {/* Five Segments */}
        <div className="mt-12 space-y-8">
          {segments.map((segment, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-sky-50 to-sky-100 border-b border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  Segment {idx + 1}: {segment.title}
                </h2>
                <p className="text-sm text-slate-600">{segment.focus}</p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                {segment.vocab.map((item, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100">
                    <div className="flex gap-3 items-start mb-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold flex-shrink-0">
                        {item.phrase}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{item.meaning}</p>
                    {item.usage && (
                      <p className="text-slate-700 text-sm italic">
                        "{item.usage}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 15 Universal Expressions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">15 Universal PEOPLE Expressions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {universalExpressions.map((expr, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="text-sky-600 font-bold text-lg flex-shrink-0">{idx + 1}.</span>
                <span className="text-slate-700">{expr}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-white border border-sky-200">
            <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider mb-2">💡 Pro Tip</p>
            <p className="text-slate-700 text-sm">
              The last expression <strong>("I wouldn't say he/she is perfect, but...")</strong> is especially powerful for Band 8 because it allows you to give <strong>balanced, natural descriptions</strong> rather than unrealistically praising someone.
            </p>
          </div>
        </div>

        {/* Example */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">📝 Example using Band 8 approach:</h3>
          <p className="text-slate-700 italic">
            "I wouldn't say my brother is perfect, because he can be a little stubborn at times, but he's incredibly <strong>dependable and supportive</strong>, and he's always <strong>been there for me</strong> whenever I've needed advice."
          </p>
        </div>
      </section>
    </main>
  );
}
