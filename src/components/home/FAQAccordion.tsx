import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQ } from '@/types';

interface FAQAccordionProps {
	faqs: FAQ[];
}

const FAQAccordion = ({ faqs }: FAQAccordionProps) => {
	if (faqs.length === 0) {
		return null;
	}

	return (
		<section id="faq">
			<h2 className="mb-4 text-lg font-bold uppercase tracking-wide">
				Frequently Asked Questions
			</h2>
			<Accordion type="single" collapsible className="w-full">
				{faqs.map((faq, index) => (
					<AccordionItem key={index} value={`faq-${index}`}>
						<AccordionTrigger className="text-left">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent>{faq.answer}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
};

export default FAQAccordion;
