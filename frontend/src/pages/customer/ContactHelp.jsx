import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Headphones,
  Mail,
  MapPin,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HELP_CATEGORIES = [
  {
    id: "orders",
    label: "Orders",
    description: "Order history, changes, and cancellations.",
    icon: Package,
  },
  {
    id: "delivery",
    label: "Delivery & Tracking",
    description: "Dispatch updates, delivery windows, and addresses.",
    icon: MapPin,
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    description: "Returns, exchanges, and refund timelines.",
    icon: RefreshCcw,
  },
  {
    id: "payments",
    label: "Payments",
    description: "Payment methods and failed transactions.",
    icon: CreditCard,
  },
  {
    id: "account",
    label: "Account & Profile",
    description: "Profile, security, and account preferences.",
    icon: UserRound,
  },
  {
    id: "products",
    label: "Products",
    description: "Sizing, materials, availability, and care.",
    icon: ShoppingBag,
  },
  {
    id: "offers",
    label: "Offers & Coupons",
    description: "Promotions, privilege codes, and offers.",
    icon: ShieldCheck,
  },
  {
    id: "technical",
    label: "Technical Support",
    description: "Help with the site, bag, or checkout.",
    icon: Wrench,
  },
];

const FAQS = [
  {
    id: "track-order",
    category: "delivery",
    question: "How can I track my order?",
    answer:
      "Open Orders from your account, select the order, and choose Track Order to view its latest delivery status.",
  },
  {
    id: "cancel-order",
    category: "orders",
    question: "Can I cancel my order?",
    answer:
      "Cancellation depends on the order status. Open the order details page as soon as possible or contact support with your order reference.",
  },
  {
    id: "order-history",
    category: "orders",
    question: "Where can I see my order history?",
    answer:
      "Your completed and current purchases are available in the Orders section of your customer account.",
  },
  {
    id: "delivery-time",
    category: "delivery",
    question: "How long will delivery take?",
    answer:
      "The estimated delivery window is shown in your order details and may vary by seller, destination, and current order status.",
  },
  {
    id: "change-address",
    category: "delivery",
    question: "How can I change my delivery address?",
    answer:
      "Use Addresses to manage saved locations. For an order already placed, contact support promptly because dispatch status may limit changes.",
  },
  {
    id: "missed-delivery",
    category: "delivery",
    question: "What happens if I miss my delivery?",
    answer:
      "Your courier will normally attempt redelivery or provide the next delivery instruction. Check the tracking information for the latest update.",
  },
  {
    id: "request-return",
    category: "returns",
    question: "How do I request a return?",
    answer:
      "Open the relevant order from Orders and choose the return or refund option. You can then select the product and explain the issue.",
  },
  {
    id: "refund-time",
    category: "returns",
    question: "When will I receive my refund?",
    answer:
      "Refund timing depends on eligibility review and the original payment method. The returns team will confirm the final timeline.",
  },
  {
    id: "exchange-item",
    category: "returns",
    question: "Can I exchange an item?",
    answer:
      "Replacement requests can be submitted from the order return page when the order is eligible for aftercare.",
  },
  {
    id: "payment-methods",
    category: "payments",
    question: "What payment methods are supported?",
    answer:
      "Available methods are shown during checkout and may include card, UPI, and cash on delivery depending on your account and destination.",
  },
  {
    id: "payment-failed",
    category: "payments",
    question: "What should I do if my payment failed?",
    answer:
      "Check your payment details and try again. If the amount was debited, keep the transaction reference and contact support before retrying repeatedly.",
  },
  {
    id: "update-profile",
    category: "account",
    question: "How can I update my profile?",
    answer:
      "Open Settings or Profile from your account navigation to update the information available to you.",
  },
  {
    id: "change-password",
    category: "account",
    question: "How can I change my password?",
    answer:
      "Use the security section in Settings to update your password. Choose a strong password that you do not reuse elsewhere.",
  },
  {
    id: "product-sizing",
    category: "products",
    question: "How do I choose the right size?",
    answer:
      "Review the size options and fit notes on the product page. If you need help, include the product name and your usual measurements in your message.",
  },
  {
    id: "coupon-use",
    category: "offers",
    question: "How do I use a coupon?",
    answer:
      "Enter an eligible privilege code in the promo field in your shopping bag or checkout. The discount is shown before you place the order.",
  },
  {
    id: "site-issue",
    category: "technical",
    question: "What should I do if the site is not working?",
    answer:
      "Refresh the page, check your connection, and try again in a current browser. Include the page and action that failed when contacting support.",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  orderId: "",
  category: "",
  message: "",
};

const SUPPORT_CHANNELS = [
  {
    label: "Email Support",
    value: "support@example.com",
    note: "Frontend placeholder",
    icon: Mail,
  },
  {
    label: "Phone Support",
    value: "+91 XXXXX XXXXX",
    note: "Frontend placeholder",
    icon: Headphones,
  },
  {
    label: "Live Chat",
    value: "Coming soon",
    note: "Frontend placeholder",
    icon: CircleHelp,
  },
];

const CATEGORY_LABELS = Object.fromEntries(
  HELP_CATEGORIES.map((category) => [category.id, category.label]),
);

export const ContactHelp = () => {
  const { user } = useSelector((state) => state.auth);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState(() => ({
    ...INITIAL_FORM,
    name: user?.name || "",
    email: user?.email || "",
  }));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [faq.question, faq.answer, CATEGORY_LABELS[faq.category]]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const selectCategory = (category) => {
    setActiveCategory(category);
    setOpenFaq(null);
    document
      .getElementById("faq")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateForm = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!form.category) nextErrors.category = "Choose an issue category.";
    if (!form.message.trim()) nextErrors.message = "Message is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    // Temporary frontend-only success state until a support API is available.
    setSubmitted(true);
    setForm((current) => ({
      ...INITIAL_FORM,
      name: current.name,
      email: current.email,
    }));
  };

  const renderError = (name) =>
    errors[name] && (
      <p className="mt-1 text-xs text-rose-700">{errors[name]}</p>
    );

  return (
    <div className="min-h-screen bg-m4m-bg px-4 py-10 font-sans text-[#111111] sm:px-6 md:py-16 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="border-b border-m4m-border pb-8 text-center">
          <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.3em] text-m4m-accent">
            Client services / concierge desk
          </span>
          <h1 className="font-serif text-3xl uppercase tracking-tight sm:text-5xl">
            How can we help?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-m4m-secondary">
            Find answers to common questions or get in touch with our support
            team.
          </p>
          <div className="mx-auto mt-7 max-w-2xl text-left">
            <label htmlFor="help-search" className="sr-only">
              Search for help
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-m4m-accent" />
              <input
                id="help-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for help..."
                className="w-full border border-m4m-border bg-white py-4 pl-12 pr-12 text-sm shadow-xs outline-none focus:border-[#111111]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear help search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-m4m-accent hover:text-[#111111]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        <section aria-labelledby="help-categories-heading">
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
              Browse support topics
            </span>
            <h2
              id="help-categories-heading"
              className="mt-1 font-serif text-2xl uppercase tracking-wider"
            >
              Help Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {HELP_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={`group border p-4 text-left transition-colors sm:p-5 ${active ? "border-[#111111] bg-[#111111] text-m4m-bg" : "border-m4m-border bg-white hover:border-[#111111]"}`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "text-m4m-bg" : "text-m4m-accent group-hover:text-[#111111]"}`}
                  />
                  <span className="mt-4 block font-serif text-base uppercase leading-snug">
                    {category.label}
                  </span>
                  <span
                    className={`mt-2 block text-xs leading-relaxed ${active ? "text-[#D7D2CA]" : "text-m4m-secondary"}`}
                  >
                    {category.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="scroll-mt-24"
        >
          <div className="mb-5 flex flex-col gap-2 border-b border-m4m-border pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Answers, at a glance
              </span>
              <h2
                id="faq-heading"
                className="mt-1 font-serif text-2xl uppercase tracking-wider"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <span className="text-xs text-m4m-secondary">
              {filteredFaqs.length}{" "}
              {filteredFaqs.length === 1 ? "article" : "articles"}
            </span>
          </div>
          {filteredFaqs.length > 0 ? (
            <div className="divide-y divide-m4m-border border-y border-m4m-border bg-white">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left text-sm font-medium hover:bg-m4m-bg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#111111]"
                    >
                      <span>
                        <span className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                          {CATEGORY_LABELS[faq.category]}
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pr-12 text-sm leading-relaxed text-m4m-secondary">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-m4m-border bg-white p-10 text-center">
              <CircleHelp className="mx-auto h-8 w-8 text-m4m-accent" />
              <h3 className="mt-4 font-serif text-xl uppercase">
                No help articles found.
              </h3>
              <p className="mt-2 text-sm text-m4m-secondary">
                Try another keyword or contact our support team directly.
              </p>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("support-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-5 inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-xs font-mono uppercase tracking-wider text-m4m-bg hover:bg-[#333333]"
              >
                Contact Support <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="quick-actions-heading">
          <div className="mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
              Self-service shortcuts
            </span>
            <h2
              id="quick-actions-heading"
              className="mt-1 font-serif text-2xl uppercase tracking-wider"
            >
              Need help with an order?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              label="Track Order"
              description="See delivery progress"
              to="/orders"
              icon={MapPin}
            />
            <QuickAction
              label="View Orders"
              description="Open your order history"
              to="/orders"
              icon={Package}
            />
            <QuickAction
              label="Request Return / Refund"
              description="Start from your order"
              to="/orders"
              icon={RefreshCcw}
            />
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("support-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex items-center justify-between border border-m4m-border bg-white p-4 text-left hover:border-[#111111]"
            >
              <span>
                <span className="block font-serif text-base uppercase">
                  Contact Support
                </span>
                <span className="mt-1 block text-xs text-m4m-secondary">
                  Send us a message
                </span>
              </span>
              <Headphones className="h-5 w-5 text-m4m-accent" />
            </button>
          </div>
          <p className="mt-3 text-[11px] text-m4m-accent">
            Select an order first to access tracking or return-specific actions.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Ways to reach us
              </span>
              <h2 className="mt-1 font-serif text-2xl uppercase tracking-wider">
                Contact Support
              </h2>
            </div>
            <div className="space-y-3">
              {SUPPORT_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.label}
                    className="flex items-start gap-4 border border-m4m-border bg-white p-4"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-m4m-accent" />
                    <div>
                      <h3 className="font-serif text-base uppercase">
                        {channel.label}
                      </h3>
                      <p className="mt-1 text-sm text-[#55504A]">
                        {channel.value}
                      </p>
                      <p className="mt-1 text-[10px] font-mono uppercase tracking-wider text-m4m-accent">
                        {channel.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            id="support-form"
            className="scroll-mt-24 border border-m4m-border bg-white p-6 shadow-xs sm:p-8 lg:col-span-3"
          >
            <div className="mb-6 border-b border-m4m-border pb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-m4m-accent">
                Concierge message
              </span>
              <h2 className="mt-1 font-serif text-2xl uppercase tracking-wider">
                Send a message
              </h2>
            </div>
            {submitted && (
              <div
                className="mb-5 flex items-start gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
                role="status"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Your support request has been submitted.</span>
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  error={errors.name}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateForm}
                  error={errors.email}
                  required
                />
              </div>
              <Field
                label="Order ID"
                name="orderId"
                value={form.orderId}
                onChange={updateForm}
                hint="Optional"
                placeholder="e.g. ATL-89241"
              />
              <div>
                <label
                  htmlFor="issue-category"
                  className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent"
                >
                  Issue category <span className="text-rose-700">*</span>
                </label>
                <select
                  id="issue-category"
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  className="w-full border border-m4m-border bg-white px-3 py-3 text-sm outline-none focus:border-[#111111]"
                >
                  <option value="">Select an issue category</option>
                  {HELP_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {renderError("category")}
              </div>
              <div>
                <label
                  htmlFor="support-message"
                  className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent"
                >
                  Message <span className="text-rose-700">*</span>
                </label>
                <textarea
                  id="support-message"
                  value={form.message}
                  onChange={(event) =>
                    updateForm("message", event.target.value)
                  }
                  rows="5"
                  placeholder="Tell us how we can help..."
                  className="w-full resize-y border border-m4m-border px-3 py-3 text-sm outline-none placeholder:text-[#AAA49D] focus:border-[#111111]"
                />
                {renderError("message")}
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 bg-[#111111] px-6 py-3.5 text-xs font-mono uppercase tracking-[0.2em] text-m4m-bg hover:bg-[#333333]"
              >
                Send Message <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

const QuickAction = ({ label, description, to, icon: Icon }) => (
  <Link
    to={to}
    className="flex items-center justify-between border border-m4m-border bg-white p-4 hover:border-[#111111]"
  >
    <span>
      <span className="block font-serif text-base uppercase">{label}</span>
      <span className="mt-1 block text-xs text-m4m-secondary">{description}</span>
    </span>
    <Icon className="h-5 w-5 text-m4m-accent" />
  </Link>
);

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  hint,
  placeholder,
  required = false,
}) => (
  <div>
    <label
      htmlFor={`support-${name}`}
      className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-m4m-accent"
    >
      {label} {required && <span className="text-rose-700">*</span>}{" "}
      {hint && <span className="normal-case tracking-normal">({hint})</span>}
    </label>
    <input
      id={`support-${name}`}
      name={name}
      type={type}
      value={value}
      onChange={(event) => onChange(name, event.target.value)}
      placeholder={placeholder}
      className="w-full border border-m4m-border px-3 py-3 text-sm outline-none focus:border-[#111111]"
    />
    {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
  </div>
);

export default ContactHelp;
