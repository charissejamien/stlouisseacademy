import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function ParentsManual() {

    const items = [
    {
      value: "billing",
      trigger: "How does billing work?",
      content:
        "We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.",
    },
    {
      value: "security",
      trigger: "Is my data secure?",
      content:
        "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data is encrypted at rest and in transit using industry-standard protocols.",
    },
    {
      value: "integration",
      trigger: "What integrations do you support?",
      content:
        "We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build custom integrations using our REST API and webhooks.",
    },
  ]

  return(
    <div className="w-[80%] sm:w-[95%] mx-auto mt-10">

      <p>Academic Year 2025-2026</p>
      <p>Institutional Manual</p>
      <p>Comprehensive guide for students and parents</p>
      <button className="bg-sla-blue text-white px-6 py-2 rounded-md">Print School Manual (PDF)</button>

      <section>
         <Accordion
          className="max-w-lg rounded-lg border"
          defaultValue={["billing"]}
          type="multiple"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-b px-4 last:border-b-0"
            >
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}