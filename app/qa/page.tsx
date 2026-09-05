"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

const qaList = [
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
  { question: "To what extent do you think social media influences our perception of reality and personal happiness?", answer: "I think social media influences our perception of reality to a great extent because people usually share only the best parts of their lives. This can make others compare themselves unfairly and feel dissatisfied with their own situation. However, if people use social media carefully and avoid constant comparison, its negative effect on happiness can be reduced." },
  { question: "Why do some people not care that their behavior disturbs people around them?", answer: "Some people may not realise that their behaviour is disturbing others because they are too focused on themselves. Others may simply lack consideration or awareness of social rules. I think better manners and empathy can help people become more respectful in public places." },
  { question: "In what ways does architecture impact the well-being of urban residents?", answer: "Architecture can greatly affect people's well-being by influencing comfort, safety, and access to natural light and green spaces. Well-designed buildings and public areas can reduce stress and make cities more pleasant to live in. In contrast, overcrowded or poorly planned environments may negatively affect both physical and mental health." },
];

const pageSizeOptions = [10, 20, 30, 50];

export default function QAPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

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
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
    setOpenQuestion(null);
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

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Q&A</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Question & Answer</h1>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700" htmlFor="pageSize">Questions per page</label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(event) => handlePageSizeChange(Number(event.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-sky-400 focus:outline-none"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={showAllAnswers}
              onChange={(event) => handleShowAllToggle(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Show all answers on this page
          </label>
        </div>

        {!showAllAnswers && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => handlePageChange(currentPageSafe - 1)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentPageSafe === 1 ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"
              }`}
              disabled={currentPageSafe === 1}
            >
              « Previous
            </button>

            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`${page}-${index}`} className="px-2 text-sm text-slate-400">
                    ...
                  </span>
                );
              }

              const isCurrentPage = currentPageSafe === page;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(Number(page))}
                  className={`min-w-10 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isCurrentPage
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPageSafe + 1)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentPageSafe === totalPages ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"
              }`}
              disabled={currentPageSafe === totalPages}
            >
              Next »
            </button>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {visibleQuestions.map((item, index) => {
            const globalIndex = (currentPageSafe - 1) * pageSize + index;
            const isOpen = showAllAnswers || openQuestion === item.question;

            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(item.question)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-base font-bold text-sky-700">{globalIndex + 1}.</span>
                    <span className="text-lg font-medium text-slate-800">{item.question}</span>
                  </div>
                  <span className="text-2xl text-sky-700">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-sky-100 bg-white px-5 py-4 text-base leading-8 text-slate-700">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showAllAnswers && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => handlePageChange(currentPageSafe - 1)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentPageSafe === 1 ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"
              }`}
              disabled={currentPageSafe === 1}
            >
              « Previous
            </button>

            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`bottom-${page}-${index}`} className="px-2 text-sm text-slate-400">
                    ...
                  </span>
                );
              }

              const isCurrentPage = currentPageSafe === page;

              return (
                <button
                  key={`bottom-${page}`}
                  type="button"
                  onClick={() => handlePageChange(Number(page))}
                  className={`min-w-10 rounded-md px-3 py-2 text-sm font-medium transition ${
                    isCurrentPage
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handlePageChange(currentPageSafe + 1)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                currentPageSafe === totalPages ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"
              }`}
              disabled={currentPageSafe === totalPages}
            >
              Next »
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
