import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

/**
 * FAQ Page
 * Complete Frequently Asked Questions page with all FAQ items
 */
const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How Does Travel in a Click Work?',
      answer: "At Travel in a Click, we're all about saving you money on travel. Each week, we spend hours finding the best flight deals and top holiday offers — so you don't have to! We're not a search engine. We personally hand-pick unbeatable travel deals and deliver them straight to your inbox. As a member, you'll also get exclusive access to over 100 in-depth travel guides to help you plan smarter, travel better, and make the most of every trip. And that's not all — members can enter into a monthly draw to win a free trip. That's why so many travelers love Travel in a Click: real deals, real experiences, and real savings.",
    },
    {
      question: 'How Much Does the Subscription Cost?',
      answer: 'The Travel in a Click membership costs just €9.99 per year — that\'s less than €1 per month, which includes:',
      bullets: [
        'Multiple flight & holiday deals every week (about 60 per month)',
        'Exclusive travel discounts & insider offers',
        'Personalized recommendations for activities & restaurants',
        'Monthly entry to win a free trip',
        'Huge savings (travel more, spend less!)',
      ],
    },
    {
      question: 'What Airport Do Your Deals Depart From?',
      answer: 'With Travel in a Click, you get deals from the airport of your choice — no more irrelevant offers from places you don\'t want to fly from! We cover all major airports in Ireland, including:',
      bullets: [
        'Dublin Airport (DUB)',
        'Cork Airport (ORK)',
        'Shannon Airport (SNN)',
        'Ireland West Airport Knock (NOC)',
        'Kerry Airport (KIR)',
        'Belfast International Airport (BFS)',
      ],
      closingText: 'Simply select your preferred airport, and we will send you only the best deals that work for you!',
    },
    {
      question: 'Is Travel in a Click a Travel Agency or Booking Agent?',
      answer: 'No, Travel in a Click is not a travel agency, flight search engine, or booking site. Instead, we spend hundreds of hours searching for the best travel deals departing from your chosen Irish airport and send you an alert when we find something amazing. If you decide to book a deal, we\'ll guide you on how to book it — usually directly with the airline or travel provider — but we don\'t sell the tickets ourselves.',
    },
    {
      question: 'How Many Emails Will I Receive?',
      answer: 'With Travel in a Click, you\'ll receive two emails per week, each packed with the best travel deals we\'ve found. That means you\'ll get around 15 different offers every week — adding up to 60+ amazing travel deals every month! More options, less hassle — so you can travel more for less!',
    },
    {
      question: 'How Does the Monthly Giveaway Work?',
      answer: 'Every month, Travel in a Click members have the chance to win a free holiday! We select an exclusive getaway, and one lucky member is chosen — no entry fee, no catch. It\'s our way of giving back to our community of adventure seekers.',
    },
    {
      question: 'How Do I Enter?',
      answer: 'When the monthly giveaway opens, you\'ll receive an email with all the details. Simply follow the instructions in that email to enter before the deadline. Good luck!',
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-24">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to know about Travel in a Click. Can't find an answer? Feel free to contact us.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index}>
                {/* Question Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg sm:text-xl font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-gray-900" />
                    ) : (
                      <Plus className="w-6 h-6 text-gray-900" />
                    )}
                  </span>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-2">
                        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                          {faq.answer}
                        </p>
                        {/* Render bullet points if they exist */}
                        {faq.bullets && (
                          <ul className="mt-3 space-y-2">
                            {faq.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="text-gray-600 leading-relaxed text-base sm:text-lg flex items-start">
                                <span className="mr-2 mt-1.5">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* Render closing text if it exists */}
                        {faq.closingText && (
                          <p className="text-gray-600 leading-relaxed text-base sm:text-lg mt-3">
                            {faq.closingText}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider - don't show after last item */}
                {index < faqs.length - 1 && (
                  <div className="border-b border-gray-200" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
