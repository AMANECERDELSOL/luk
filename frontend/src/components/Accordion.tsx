import { useState } from 'react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
                <div className="accordion-body">{children}</div>
            </div>
        </div>
    );
}

interface Props {
    items: { title: string; content: string; defaultOpen?: boolean }[];
}

export default function Accordion({ items }: Props) {
    return (
        <div className="accordion">
            {items.map((item, i) => (
                <AccordionItem key={i} title={item.title} defaultOpen={item.defaultOpen}>
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
}
