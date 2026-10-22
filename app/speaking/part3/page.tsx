"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

export const qaList = [
  { question: "Can physical workers have higher salaries in the future?", answer: "Actually, I think it's hard to see this happening as the average education level keeps rising, while the demand for physical work declines. Instead, there is an increasing need for high-tech jobs, which may result in unemployment for physical workers. So, rather than seeing higher salaries, they might face job insecurity. But you know, there's always a chance if there's a shortage of labor in certain manual jobs, maybe wages could go up, but that's not the general trend." },
  { question: "What kinds of people are likely to be the role models for teenagers?", answer: "Well, nowadays, I'd say that it's often celebrities—like singers, actors, and football players—who really capture the imagination of teenagers. They're everywhere on social media and TV, so it's natural for kids to look up to them. Also, models are a big deal for teens these days because everyone seems obsessed with looks and wanting to be more attractive. So, yeah, those are the kinds of people that typically become role models for the younger crowd." },
  { question: "In what ways does globalization affect the preservation of local traditions and customs?", answer: "Well, you know, globalization is spreading like wildfire these days, and it's having a real impact on how we hold onto our local traditions. It's like we're all seeing the same stuff on social media and trying to imitate it, which isn't always great for keeping our unique cultures alive. We might start to forget where we come from, our language, our customs, because everyone thinks we should fit into this modern, globalized mold. So, yeah, it's getting pretty tough to preserve our local heritage when we're all trying to be the same." },
  { question: "Is it reasonable to charge a high price for handmade things?", answer: "Absolutely, I think it's completely fair to ask a premium price for handmade goods. You see, crafting these items usually involves a lot of time, exceptional skill, and a personal touch that you just don't get with mass-produced stuff. Plus, the quality and individuality of handmade products really set them apart and make them special. Those who value this craftsmanship are typically happy to pay a bit more because they understand what goes into making these unique pieces." },
  { question: "How do family dynamics change as children grow older?", answer: "Family dynamics definitely shift as children grow older. When kids are young, parents often play a protective and guiding role. But as they mature, the relationship becomes more balanced and collaborative. Children become more independent, and parents start to respect their decisions and opinions. In addition, siblings who might have had minor squabbles in childhood often grow closer as they share more meaningful experiences and support each other's life challenges." },
  { question: "How important is it to have rules in school?", answer: "Having rules in a school is absolutely crucial, don't you think? They create a framework that helps maintain order, which is really important for creating a positive learning environment. Without some structure, things can easily spiral out of control, leading to distractions and chaos. Additionally, rules teach students about responsibility and respect, which are essential life skills. They also provide clear expectations so everyone knows what is acceptable and what is not. In the end, rules help foster a sense of community and safety, making it easier for everyone to focus on their studies." },
  { question: "Do you agree that most beauty products are a waste of money?", answer: "I agree. Apart from the essentials like facial cleansers or some supplements, most of the products are just a waste of money. It is easy to hook people because of their insecurities. Most of the time, you don't even need these products because beauty comes from the soul and your daily routine, like exercising, eating healthy food, and essentially your lifestyle." },
  { question: "How might the increasing reliance on technology impact traditional forms of art and creative expression?", answer: "I think increasing reliance on technology can impact traditional forms of art to a significant extent. The reason is that, at first, technology seems very convenient and can actually create many artworks faster than before. However, advancements in AI, for example, can reduce our creativity as we rely too much on the help of AI and technology to create paintings, sculptures, writing, and so much more. In the end, we end up generating similar art with no new innovation because the technology that is supposed to help us in creating art is actually replacing our creativity, and we end up generating just similar forms of art as before." },
  { question: "How do the expensive items that younger people want to buy differ from those older people want to buy?", answer: "Younger people often want expensive items such as smartphones, branded clothes, or the latest gadgets because these products are linked to trends and social status. In contrast, older people are more likely to spend money on practical or long-term purchases, such as property, cars, or high-quality household items. I think this difference mainly comes from their priorities and financial responsibilities." },
  { question: "What kind of things can children learn to cook?", answer: "Children can learn to cook simple dishes like sandwiches, salads, eggs, or basic pasta. These foods are easy to prepare and help them develop practical skills and confidence in the kitchen. As they get older, they can gradually learn more complicated recipes." },
  { question: "Who would like to take photos more often, young people or older people?", answer: "Young people are generally more likely to take photos because they use smartphones and social media more frequently. They often capture everyday moments, food, trips, and social events to share online. Older people may take fewer photos, but they often focus more on family occasions and special memories." },
  { question: "What kinds of rules are common in a school?", answer: "Common school rules include being punctual, wearing the correct uniform, respecting teachers and classmates, and completing homework on time. Schools also usually have rules against bullying, cheating, and using phones during lessons. These rules help maintain discipline and create a safe learning environment." },
  { question: "What do young people have strong opinions about?", answer: "Young people often have strong opinions about issues like education, career choices, social media, and climate change. They are also quite vocal about personal freedom and social equality. I think this is because they are more exposed to different viewpoints through the internet and are eager to shape their future." },
  { question: "Why do some people not like staying in hotels?", answer: "Some people dislike staying in hotels because they may find them less comfortable or private than their own homes. Others might be concerned about cleanliness, noise, or the high cost of accommodation. In general, people who prefer familiar surroundings may feel more relaxed staying with family or in a rented apartment." },
  { question: "Do you think young people should learn to cook at home or at school?", answer: "I think young people should ideally learn to cook both at home and at school. At home, they can learn practical family recipes, while school can teach them basic nutrition, hygiene, and cooking techniques. This combination would help them become more independent and make healthier food choices." },
  { question: "What kind of things give status to people in your country?", answer: "In my country, people often gain status through education, a respected profession, financial success, and social connections. Owning a nice house or car can also influence how others see them. However, I think personal character and contribution to society are becoming increasingly important as well." },
  { question: "Should all museums and art galleries be free?", answer: "I don't think all museums and art galleries should be completely free, because they need money for maintenance, staff, and exhibitions. However, public museums could offer free entry on certain days or give discounts to students and children. This would make culture more accessible while still supporting the institutions financially." },
  { question: "Do you believe social media has made it easier or harder for people to form meaningful relationships?", answer: "I think social media has made it easier to meet and stay connected with people, especially those who live far away. However, online communication can sometimes be quite superficial and may not create strong emotional bonds. So, while social media is useful for starting relationships, meaningful connections usually require deeper and more personal interaction." },
  { question: "In what ways do you believe social media has altered our perception of reality?", answer: "Social media has changed our perception of reality by showing us carefully selected and often edited versions of people's lives. This can create unrealistic expectations about success, beauty, and happiness. It can also make misinformation spread quickly, so people may sometimes struggle to separate facts from opinions." },
  { question: "Why do some people not care that their behavior disturbs people around them?", answer: "Some people may not realise that their behaviour is disturbing others because they are too focused on themselves. Others may simply lack consideration or awareness of social rules. I think better manners and empathy can help people become more respectful in public places." },
  { question: "In what ways does architecture impact the well-being of urban residents?", answer: "Architecture can greatly affect people's well-being by influencing comfort, safety, and access to natural light and green spaces. Well-designed buildings and public areas can reduce stress and make cities more pleasant to live in. In contrast, overcrowded or poorly planned environments may negatively affect both physical and mental health." },
  { question: "What skills do you think will be important in the future?", answer: "I think digital skills, communication, problem-solving, and critical thinking will be very important in the future. Technology is developing quickly, so people will need to learn new tools and adapt to change. Creativity and teamwork will also remain valuable because many jobs require people to work together and find new solutions." },
  { question: "How might the increasing reliance on technology impact our ability to form meaningful relationships?", answer: "Increasing reliance on technology can make communication faster and easier, especially over long distances. However, too much online interaction may reduce face-to-face communication and make relationships feel less personal. I think technology is helpful as long as people maintain a healthy balance between online and real-life connections." },
  { question: "What are the advantages of living in the countryside?", answer: "Living in the countryside has several advantages, such as cleaner air, less traffic, and a quieter environment. People can also enjoy more green spaces and a slower, less stressful lifestyle. In addition, rural communities are often close-knit, so neighbours may have stronger relationships with each other." },
  { question: "What kinds of movies are popular (successful) in your country?", answer: "In my country, action, comedy, and romantic movies are generally very popular. Family dramas and films based on social issues can also be successful if they have a strong story. Recently, audiences have also become more interested in thrillers and high-quality local productions." },
  { question: "Do you think parents should help their children develop the reading habit from an early age?", answer: "Yes, definitely. Parents should encourage reading from an early age because it improves children's vocabulary, imagination, and concentration. It can also help them perform better at school and develop a lifelong interest in learning." },
  { question: "What role do you think artificial intelligence will play in shaping the future of education?", answer: "Artificial intelligence will likely make education more personalized and accessible. It can help students learn at their own pace, provide instant feedback, and support teachers with routine tasks. However, students should not become too dependent on AI, as critical thinking and human interaction are still essential." },
  { question: "Do you think diet is important?", answer: "Yes, I think diet is very important because it directly affects our health, energy, and overall well-being. A balanced diet can help prevent many diseases and improve both physical and mental performance. However, healthy eating should also be combined with regular exercise and enough sleep." },
  { question: "Why do some students dislike studying at school?", answer: "Some students dislike studying at school because they find the lessons boring or too difficult. In some cases, teachers may use traditional methods that do not keep students interested. They may also feel stressed because of exams, homework, and academic pressure. As a result, they gradually lose motivation to study." },
  { question: "Why do people like to buy expensive sportswear for playing ball games?", answer: "Many people buy expensive sportswear because they believe it offers better comfort, quality, and performance. Branded products can also make players feel more confident while playing. In addition, some people buy them because they want to look fashionable or follow their favourite athletes." },
  { question: "Why do people choose to travel by public transport?", answer: "People choose public transport because it is usually cheaper and more convenient than driving a private car. It can also reduce traffic congestion and save people from worrying about parking. Moreover, using buses or trains is generally more environmentally friendly." },
  { question: "How can urban planning better address the needs of an aging population?", answer: "Urban planning can support an aging population by creating safer, more accessible public spaces. Cities should provide smooth footpaths, ramps, benches, good lighting, and reliable public transport. It is also important to keep healthcare services, shops, and parks close to residential areas so elderly people can live more independently." },
  { question: "Do people in your country enjoy going to open-air markets that sell things like food, clothes, or old objects? Which type of market is more popular, and why?", answer: "Yes, many people in my country enjoy visiting open-air markets because they are lively, affordable, and offer a wide variety of products. Food and clothing markets are probably the most popular because people need these items regularly. They also attract customers because prices are often negotiable and cheaper than in shopping malls." },
  { question: "How interested are young people in your country in learning to drive?", answer: "Many young people in my country are quite interested in learning to drive because it gives them more freedom and independence. It can also make travelling to work or university more convenient. However, some young people are less interested because of heavy traffic, high fuel costs, and the availability of public transport." },
  { question: "What impact do you think globalization has on the preservation of local languages and dialects?", answer: "Globalization can have both positive and negative effects on local languages and dialects. On the one hand, global languages like English often become more dominant in education, business, and media, which may weaken smaller languages. On the other hand, technology and social media can help preserve local languages by making them easier to teach, record, and share with younger generations." },
  { question: "What are some potential drawbacks of relying heavily on social media for news and information?", answer: "Relying heavily on social media for news can be risky because false or misleading information can spread very quickly. People may also become trapped in echo chambers and only see opinions they already agree with. In addition, sensational content is often promoted more than accurate and balanced reporting." },
  { question: "What are the differences between the work of a doctor and a nurse?", answer: "Doctors are mainly responsible for diagnosing illnesses, prescribing treatment, and making important medical decisions. Nurses, on the other hand, provide day-to-day care, monitor patients, and assist doctors during treatment. Although their roles are different, both are essential for providing effective healthcare." },
  { question: "Is money always the most important thing when choosing a job?", answer: "No, I don't think money is always the most important factor when choosing a job. Job satisfaction, career growth, work-life balance, and a positive working environment can be equally important. A high salary may be attractive, but people may still feel unhappy if the job is stressful or unfulfilling." },
  { question: "What are the advantages and disadvantages of living in a multicultural society?", answer: "Living in a multicultural society allows people to learn about different cultures, traditions, and ways of thinking. It can make society more open-minded and diverse. However, cultural differences may sometimes cause misunderstandings, communication problems, or social tension if people are not respectful of one another." },
  { question: "What are the potential consequences of increased automation on the long-term job market and the skills needed to succeed?", answer: "Increased automation may replace some routine and repetitive jobs, but it can also create new opportunities in technology and other skilled fields. In the future, workers will probably need stronger digital, problem-solving, and creative skills. Therefore, continuous learning and the ability to adapt will become increasingly important." },
  { question: "How can governments support arts and culture?", answer: "Governments should support arts and culture by funding museums, theatres, festivals, and local artists. They can also protect historical sites and include cultural education in schools. This helps preserve national identity while giving people more opportunities to experience and appreciate the arts." },
  { question: "What challenges do young people face today?", answer: "Young people today face several challenges, including academic pressure, unemployment, and the rising cost of living. Many also struggle with social media pressure and uncertainty about their future careers. As a result, they need to be adaptable, skilled, and mentally resilient." },
  { question: "Which expensive items would many young people in your country like to buy?", answer: "Many young people in my country would like to buy expensive smartphones, laptops, motorbikes, and branded clothes. These items are often seen as symbols of success and a modern lifestyle. Some also buy them because they offer better quality, useful features, and greater convenience." },
  { question: "How do advancements in artificial intelligence change our understanding of human creativity?", answer: "Advancements in artificial intelligence are changing our understanding of creativity because machines can now produce art, music, and written content. This suggests that creativity is not limited to humans in the way we once thought. However, human creativity still stands out because it is closely connected to emotions, personal experience, and imagination." },
  { question: "Why are there so many stories about famous people in the news?", answer: "There are many stories about famous people because the public is naturally interested in their personal lives, careers, and lifestyles. Such stories also attract more viewers and generate higher engagement for news companies. In addition, celebrities often influence fashion, entertainment, and social trends." },
  { question: "Do you think that children should always go to the school nearest to where they live?", answer: "Not necessarily. Going to a nearby school can save time and reduce travel costs, but parents should also consider the quality of education and facilities. If a better school is slightly farther away, it may be worth travelling for stronger academic opportunities." },
  { question: "How well do people generally know neighbours in your country?", answer: "In my country, people generally know their neighbours quite well, especially in villages and small towns. They often talk regularly, visit each other, and help during emergencies or family events. However, in large cities, people may have less contact with their neighbours because of busy lifestyles." },
  { question: "What kinds of sports would you like to play in the future?", answer: "In the future, I would like to play badminton and go swimming because both are enjoyable and good for my health. Badminton can improve fitness and coordination, while swimming is a great full-body exercise. I would also like to try tennis because it seems both challenging and exciting." },
  { question: "What do you do to relax?", answer: "To relax, I usually listen to music, watch movies, or spend time with friends and family. Sometimes I also go for a short walk or use social media. These activities help me reduce stress and refresh my mind." },
  { question: "Should people be banned from talking loudly in public places?", answer: "I don't think people should be completely banned from talking loudly in public places. However, they should be expected to keep their voices down in places like hospitals, libraries, and public transport. Clear rules about noise are more practical than a total ban." },
  { question: "Do you believe that social media platforms have a responsibility to combat the spread of misinformation?", answer: "Yes, I believe social media platforms have a responsibility to reduce the spread of misinformation. They should identify false content, promote reliable sources, and make users aware of misleading posts. However, they also need to balance this responsibility with freedom of expression. Overall, better fact-checking can help create a more trustworthy online environment." },
  { question: "How might the rise of remote work reshape our understanding of community and social interaction?", answer: "The rise of remote work may change the way people define community, as social interaction is no longer limited to physical workplaces. People can build professional relationships with colleagues from different cities or even countries through online platforms. However, reduced face-to-face contact may make some relationships feel less personal. As a result, communities may become more digital, flexible, and globally connected." },
  { question: "Do you think people wear clothes that reflect their personality?", answer: "Yes, I think clothing often reflects a person's personality and lifestyle. For example, someone who prefers bright colours may be more expressive, while others may choose simple clothes because they value comfort and practicality. However, clothing does not always reveal personality, since people also dress according to work, culture, or social expectations." },
  { question: "What is the difference between payment for mental work and physical work?", answer: "Mental work is usually paid based on knowledge, skills, experience, and decision-making responsibility. Physical work, on the other hand, is often paid according to effort, working hours, and the difficulty or risk involved. However, the actual salary depends greatly on the industry, demand, and level of specialization." },
  { question: "Do you think machines could replace human workers in the future?", answer: "Yes, machines may replace some human workers, especially in repetitive or routine jobs. However, they are less likely to fully replace roles that require creativity, empathy, and complex decision-making. In the future, people may need to develop new skills and work alongside machines rather than compete with them." },
  { question: "Do you like to learn on your own or with others?", answer: "I prefer learning on my own because I can study at my own pace and focus on the topics I find difficult. However, learning with others is also useful because we can exchange ideas and solve problems together. So, I think a combination of both methods works best." },
];

const revisionKeywords = [
  ["rising education", "declining manual work", "high-tech demand", "job insecurity", "labour shortage", "possible wage rise"],
  ["celebrities", "singers and actors", "football players", "social media influence", "appearance", "teen role models"],
  ["globalisation", "social media imitation", "cultural uniformity", "language loss", "local customs", "heritage preservation"],
  ["premium price", "time and skill", "personal touch", "high quality", "individuality", "craftsmanship"],
  ["protective parents", "growing independence", "balanced relationship", "mutual respect", "closer siblings", "family support"],
  ["order and structure", "positive learning", "responsibility", "respect", "clear expectations", "community safety"],
  ["mostly unnecessary", "consumer insecurity", "basic essentials", "inner beauty", "exercise", "healthy lifestyle"],
  ["technology convenience", "faster creation", "AI reliance", "reduced creativity", "similar artwork", "less innovation"],
  ["smartphones and brands", "trends", "social status", "property and cars", "long-term value", "different priorities"],
  ["simple dishes", "sandwiches and salads", "eggs and pasta", "practical skills", "kitchen confidence", "gradual progress"],
  ["young people", "smartphones", "social media", "everyday moments", "older people", "family memories"],
  ["punctuality", "school uniform", "respect", "homework", "no bullying or cheating", "safe discipline"],
  ["education", "career choices", "social media", "climate change", "freedom and equality", "internet viewpoints"],
  ["less comfort", "limited privacy", "cleanliness", "noise", "high cost", "familiar surroundings"],
  ["home and school", "family recipes", "nutrition", "hygiene", "cooking techniques", "healthy independence"],
  ["education", "respected profession", "financial success", "social connections", "property", "character and contribution"],
  ["maintenance costs", "staff and exhibitions", "selected free days", "student discounts", "cultural access", "financial support"],
  ["easy connection", "long distance", "superficial communication", "weak emotional bonds", "personal interaction", "meaningful relationships"],
  ["edited lives", "unrealistic expectations", "success and beauty", "misinformation", "facts and opinions", "distorted reality"],
  ["self-focus", "low awareness", "lack of consideration", "social rules", "good manners", "empathy and respect"],
  ["comfort and safety", "natural light", "green spaces", "lower stress", "urban planning", "physical and mental health"],
  ["digital skills", "communication", "problem-solving", "critical thinking", "adaptability", "creativity and teamwork"],
  ["faster communication", "long-distance connection", "less face-to-face contact", "less personal relationships", "healthy balance", "real-life connections"],
  ["cleaner air", "less traffic", "quiet environment", "green spaces", "slower lifestyle", "close-knit communities"],
  ["action and comedy", "romantic movies", "family dramas", "social issues", "thrillers", "local productions"],
  ["early reading", "vocabulary", "imagination", "concentration", "school performance", "lifelong learning"],
  ["personalized learning", "accessibility", "learning pace", "instant feedback", "teacher support", "critical thinking"],
  ["health and energy", "well-being", "balanced diet", "disease prevention", "physical and mental performance", "exercise and sleep"],
  ["boring or difficult lessons", "traditional teaching", "low engagement", "exams and homework", "academic pressure", "lost motivation"],
  ["comfort and quality", "better performance", "branded products", "confidence", "fashion", "favourite athletes"],
  ["lower cost", "convenience", "less congestion", "no parking worries", "buses and trains", "environmental benefits"],
  ["accessible public spaces", "smooth footpaths and ramps", "benches and lighting", "reliable transport", "nearby services", "independent living"],
  ["lively atmosphere", "affordable prices", "product variety", "food and clothing", "negotiable prices", "cheaper than malls"],
  ["freedom and independence", "convenient travel", "work and university", "heavy traffic", "fuel costs", "public transport"],
  ["globalization", "dominant global languages", "weaker local languages", "technology", "language preservation", "younger generations"],
  ["misinformation", "rapid spread", "echo chambers", "one-sided opinions", "sensational content", "balanced reporting"],
  ["diagnosis and treatment", "medical decisions", "day-to-day care", "patient monitoring", "assisting doctors", "effective healthcare"],
  ["job satisfaction", "career growth", "work-life balance", "positive environment", "high salary", "stress and fulfilment"],
  ["cultural learning", "open-mindedness", "diversity", "misunderstandings", "communication problems", "social tension"],
  ["job displacement", "new opportunities", "digital skills", "problem-solving", "creativity", "continuous learning and adaptability"],
  ["government funding", "museums and theatres", "festivals and local artists", "historical sites", "cultural education", "national identity"],
  ["academic pressure", "unemployment", "cost of living", "social media pressure", "career uncertainty", "mental resilience"],
  ["smartphones and laptops", "motorbikes", "branded clothes", "status symbols", "better quality", "features and convenience"],
  ["AI-generated content", "human emotions", "personal experience", "original thinking", "creative tool", "human imagination"],
  ["public curiosity", "celebrity lifestyles", "more viewers", "news engagement", "fashion and entertainment", "social trends"],
  ["nearby school", "time and travel costs", "education quality", "school facilities", "better school", "academic opportunities"],
  ["close neighbours", "villages and towns", "regular contact", "mutual help", "large cities", "busy lifestyles"],
  ["badminton", "swimming", "fitness and coordination", "full-body exercise", "tennis", "challenge and excitement"],
  ["music and movies", "friends and family", "short walks", "social media", "reduce stress", "refresh the mind"],
  ["no total ban", "lower voices", "hospitals and libraries", "public transport", "noise rules", "public consideration"],
  ["platform responsibility", "false content", "reliable sources", "misleading posts", "freedom of expression", "fact-checking"],
  ["remote work", "digital communities", "global colleagues", "online relationships", "less face-to-face contact", "flexible connection"],
  ["clothing and personality", "bright colours", "self-expression", "comfort and practicality", "work and culture", "social expectations"],
  ["knowledge and skills", "experience", "decision-making", "physical effort", "difficulty and risk", "industry demand"],
  ["routine jobs", "partial replacement", "creativity and empathy", "complex decisions", "new skills", "human-machine collaboration"],
  ["independent learning", "own pace", "difficult topics", "group learning", "idea exchange", "combined approach"],
];

const pageSizeOptions = [10, 20, 30, 50];
const ignoredKeywordWords = new Set(["about", "after", "along", "because", "between", "could", "different", "people", "should", "their", "these", "through", "while", "would"]);

function highlightKeywords(answer: string, keywords: string[]) {
  const terms = new Set<string>();

  keywords.forEach((keyword) => {
    terms.add(keyword.toLowerCase());
    keyword.toLowerCase().match(/[a-z]+/g)?.forEach((word) => {
      if (word.length >= 5 && !ignoredKeywordWords.has(word)) terms.add(word);
    });
  });

  const escapedTerms = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\const pageSizeOptions = [10, 20, 30, 50];"));

  if (escapedTerms.length === 0) return answer;

  const pattern = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");
  const keywordSet = new Set([...terms]);

  return answer.split(pattern).map((part, index) =>
    keywordSet.has(part.toLowerCase()) ? (
      <strong key={`${part}-${index}`} className="font-bold text-sky-800">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function updatePageUrl(page: number, pageSize: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

export default function QAPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  useEffect(() => {
    const restorePageFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedPageSize = Number(params.get("pageSize"));
      const restoredPageSize = pageSizeOptions.includes(requestedPageSize) ? requestedPageSize : 20;
      const maximumPage = Math.max(1, Math.ceil(qaList.length / restoredPageSize));
      const requestedPage = Number(params.get("page"));
      const restoredPage = Number.isInteger(requestedPage)
        ? Math.min(Math.max(requestedPage, 1), maximumPage)
        : 1;

      setPageSize(restoredPageSize);
      setCurrentPage(restoredPage);
      setOpenQuestion(null);
    };

    restorePageFromUrl();
    window.addEventListener("popstate", restorePageFromUrl);
    return () => window.removeEventListener("popstate", restorePageFromUrl);
  }, []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(qaList.length / pageSize)), [pageSize]);

  const currentPageSafe = Math.min(currentPage, totalPages);

  const visibleQuestions = useMemo(() => {
    const start = (currentPageSafe - 1) * pageSize;
    return qaList.slice(start, start + pageSize);
  }, [currentPageSafe, pageSize]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: Array<number | string> = [1];

    if (currentPageSafe > 3) pages.push("...");

    const start = Math.max(2, currentPageSafe - 1);
    const end = Math.min(totalPages - 1, currentPageSafe + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPageSafe < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  }, [currentPageSafe, totalPages]);

  const handleToggle = (question: string) => {
    setOpenQuestion((current) => (current === question ? null : question));
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setCurrentPage(nextPage);
    setOpenQuestion(null);
    updatePageUrl(nextPage, pageSize);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
    setOpenQuestion(null);
    updatePageUrl(1, nextPageSize);
  };

  const handleShowAllToggle = (checked: boolean) => {
    setShowAllAnswers(checked);
    setOpenQuestion(null);
  };

  return (
        <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={60}
              height={60}
              className="rounded-full"
              unoptimized
            />
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 px-6 py-6 text-white shadow-lg shadow-blue-900/10 md:px-8">
          <div className="absolute -right-8 -top-16 h-40 w-40 rounded-full border border-white/15"></div>
          <div className="absolute -right-2 -top-10 h-28 w-28 rounded-full border border-white/10"></div>
          
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-100 ring-1 ring-white/20">
                IELTS Speaking
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                Part 3 <span className="text-sky-200">· Deep Analysis</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-sky-100 md:text-base">
                Think deeper. Speak clearly.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/speaking/part3/preview" className="rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:bg-amber-200">A4 preview & PDF</Link>
              <div className="min-w-20 rounded-xl bg-white/10 px-4 py-2.5 text-center ring-1 ring-white/20 backdrop-blur-sm">
                <div className="text-xl font-black text-white">50+</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-sky-200">Topics</div>
              </div>
              <div className="min-w-20 rounded-xl bg-white/10 px-4 py-2.5 text-center ring-1 ring-white/20 backdrop-blur-sm">
                <div className="text-xl font-black text-white">8+</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-sky-200">Band</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider" htmlFor="pageSize">View</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-sky-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>{option} Questions</option>
                ))}
              </select>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-600 transition-colors hover:text-sky-700">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={showAllAnswers}
                  onChange={(event) => handleShowAllToggle(event.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-md border-2 border-slate-300 transition-all checked:border-sky-600 checked:bg-sky-600"
                />
                <span className="absolute left-1 top-1 h-3 w-3 rounded-sm bg-white opacity-0 transition-opacity peer-checked:opacity-100"></span>
              </div>
              Expand all answers
            </label>
          </div>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-slate-100 p-2 shadow-inner">
          <button
            type="button"
            onClick={() => handlePageChange(currentPageSafe - 1)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              currentPageSafe === 1 ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-white hover:text-sky-600 hover:shadow-sm"
            }`}
            disabled={currentPageSafe === 1}
          >
            Previous
          </button>
          {pageNumbers.map((page, index) => {
            if (page === "...") return <span key={`page-dot-${index}`} className="px-2 text-sm font-bold text-slate-400">...</span>;
            const isCurrentPage = currentPageSafe === page;
            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(Number(page))}
                className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                  isCurrentPage ? "bg-sky-600 text-white shadow-md scale-110" : "text-slate-600 hover:bg-white hover:text-sky-600 hover:shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handlePageChange(currentPageSafe + 1)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              currentPageSafe === totalPages ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-white hover:text-sky-600 hover:shadow-sm"
            }`}
            disabled={currentPageSafe === totalPages}
          >
            Next
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3">
          {visibleQuestions.map((item, index) => {
            const globalIndex = (currentPageSafe - 1) * pageSize + index;
            const isOpen = showAllAnswers || openQuestion === item.question;
            return (
              <div
                key={item.question}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen ? "border-sky-500 bg-white shadow-md ring-2 ring-sky-500/5" : "border-slate-200 bg-white shadow-sm hover:border-sky-200 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(item.question)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 sm:px-5"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-black transition-colors ${
                      isOpen ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600"
                    }`}>
                      {globalIndex + 1}
                    </div>
                    <span className={`text-base font-bold leading-snug transition-colors ${
                      isOpen ? "text-sky-700" : "text-slate-800"
                    }`}>{item.question}</span>
                  </div>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen ? "rotate-45 border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-400 group-hover:border-sky-300 group-hover:text-sky-500"
                  }`}>
                    <span className="text-xl font-medium leading-none">+</span>
                  </div>
                </button>
                {isOpen && (
                  <div className="relative border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-base leading-relaxed text-slate-700">
                    <div className="absolute -left-1 top-0 h-full w-1 bg-sky-600"></div>
                    {highlightKeywords(item.answer, revisionKeywords[globalIndex] ?? [])}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-slate-100 p-2 shadow-inner">
          <button
            type="button"
            onClick={() => handlePageChange(currentPageSafe - 1)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              currentPageSafe === 1 ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-white hover:text-sky-600 hover:shadow-sm"
            }`}
            disabled={currentPageSafe === 1}
          >
            Previous
          </button>
          {pageNumbers.map((page, index) => {
            if (page === "...") return <span key={`bottom-dot-${index}`} className="px-2 text-sm font-bold text-slate-400">...</span>;
            const isCurrentPage = currentPageSafe === page;
            return (
              <button
                key={`bottom-${page}`}
                type="button"
                onClick={() => handlePageChange(Number(page))}
                className={`min-w-10 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
                  isCurrentPage ? "bg-sky-600 text-white shadow-md scale-110" : "text-slate-600 hover:bg-white hover:text-sky-600 hover:shadow-sm"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handlePageChange(currentPageSafe + 1)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              currentPageSafe === totalPages ? "cursor-not-allowed text-slate-400" : "text-slate-700 hover:bg-white hover:text-sky-600 hover:shadow-sm"
            }`}
            disabled={currentPageSafe === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}










