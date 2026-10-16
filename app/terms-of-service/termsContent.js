/**
 * Content for /terms-of-service.
 *
 * Block types:
 *   p       — body paragraph
 *   lead    — emphasized body paragraph (secondary color)
 *   heading — sub-heading inside a section
 *   points  — arrow bullet list; each item is { label?, text }
 */

export const EFFECTIVE_DATE = "Feb 14, 2026";

export const TERMS_SECTIONS = [
  {
    id: "website-purpose",
    title: "Website Purpose & Educational Disclaimer",
    blocks: [
      {
        type: "p",
        text: "This website is owned and operated by 833PROBAID® (“Company,” “we,” “our,” or “us”) for informational, educational, literary, and communication purposes related to real estate services involving probate, trust, conservatorship, and fiduciary-controlled assets.",
      },
      {
        type: "p",
        text: "All articles, resources, guides, checklists, and media shared on this platform are intended strictly for general educational and informational purposes. Nothing contained on this website constitutes legal, financial, accounting, investment, or tax advice, nor does it establish a professional consultation or binding advisory relationship.",
        last: true,
      },
    ],
  },
  {
    id: "no-agency-relationship",
    title: "No Agency or Professional Relationship",
    blocks: [
      {
        type: "p",
        text: "Use of this website, reliance on educational materials, submission of any online form, application, or any electronic communication with 833PROBAID® does NOT create a real estate agency relationship, fiduciary relationship, broker-client relationship, or attorney-client relationship. Any such professional relationship is exclusively established through a separate, formally executed written agreement signed by both parties.",
        last: true,
      },
    ],
  },
  {
    id: "professional-limitation",
    title: "Professional Limitation & Service Disclosure",
    blocks: [
      {
        type: "lead",
        text: "833PROBAID® provides specialized real estate sales and structural coordination services only.",
      },
      {
        type: "p",
        text: "We are NOT attorneys, certified financial advisors, tax professionals, or mediators. We do not provide legal advice, tax strategies, financial planning, or formal dispute resolution. You are strictly instructed to consult licensed legal and financial professionals for those specific matters.",
      },
      {
        type: "points",
        items: [
          {
            label: "No Non-Real Estate Support",
            text: "Our services are strictly logistical, transactional, and operational. We do not provide personal counseling, legal advocacy, emotional support, or therapeutic services.",
          },
        ],
      },
    ],
  },
  {
    id: "scope-of-services",
    title: "Scope of Services & Automated Property Estimate Disclaimer",
    blocks: [
      {
        type: "lead",
        text: "833PROBAID® provides real estate-related logistics, execution, transaction services, and property valuation overviews.",
      },
      {
        type: "points",
        items: [
          {
            label: "Automated Valuations & Third-Party Tools",
            text: "All property valuations, estimates, or automated outputs provided through this website, QR codes, or any third-party tools are for general informational purposes only. These values are generated entirely through automated systems or third-party platforms based on limited or public data, are not verified through physical inspection, and do not constitute official appraisals or professional valuations.",
          },
          {
            label: "Virtually Staged & AI-Altered Media",
            text: "In compliance with California real estate marketing standards, any property images or listing graphics displayed on this site that have been digitally altered, virtually staged, or enhanced using artificial intelligence (AI) are for illustrative marketing purposes only and do not represent the current, physical “as-is” condition of the estate asset.",
          },
          {
            label: "No Accuracy Guarantees",
            text: "833PROBAID® does not guarantee the accuracy, completeness, or reliability of any automated estimate. Actual property value may vary significantly based on internal condition, structural wear, location, legal probate status, and changing market conditions. All electronic market analyses are speculative opinions and must not be relied upon for legal or court proceedings.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-communications",
    title: "Artificial Intelligence (AI) Communications & Website Assistant",
    blocks: [
      {
        type: "p",
        text: "This website may utilize artificial intelligence (“AI”), including our virtual assistant (“Alex”), to provide visitors with general educational information regarding probate, trust, conservatorship, partition, successor-in-interest matters, and estate-related real estate transactions.",
      },
      {
        type: "p",
        text: "AI-generated responses are generated automatically and are provided solely for informational and educational purposes. They do not constitute legal advice, tax advice, financial advice, appraisal services, brokerage representation, or any professional opinion.",
      },
      {
        type: "p",
        text: "Although we make reasonable efforts to improve the accuracy and reliability of AI-generated content, automated responses may be incomplete, inaccurate, outdated, or may not apply to your specific circumstances. You should independently verify all information with the appropriate licensed professional before making legal, financial, tax, or real estate decisions.",
      },
      {
        type: "p",
        text: "Use of the AI assistant does not create an attorney-client relationship, broker-client relationship, fiduciary relationship, agency relationship, or any contractual relationship with 833PROBAID®.",
        last: true,
      },
    ],
  },
  {
    id: "professional-network",
    title: "Professional Network and Third-Party Vendors",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® maintains a professional network of top independent resources—including attorneys, tax advisors, contractors, appraisers, inspectors, and other specialized experts—available to assist with your estate needs.",
      },
      {
        type: "p",
        text: "However, your utilization of this network or submission of a vendor application on our site is strictly governed by the following:",
        primary: true,
      },
      {
        type: "points",
        items: [
          {
            label: "No Control or Liability",
            text: "All network professionals and third-party vendors operate completely independently from us. We do not control, supervise, manage, or guarantee their services, advice, performance, workmanship, pricing, or timelines. We are not legally liable or responsible for their actions or errors. We may coordinate services, but we do not guarantee availability, pricing, or outcomes of any vendor.",
          },
          {
            label: "No Compensation from Vendors (RESPA Compliance)",
            text: "833PROBAID® does NOT receive referral fees, kickbacks, or any form of financial compensation from these vendors or network professionals unless explicitly disclosed to you in writing in strict compliance with the Real Estate Settlement Procedures Act (RESPA).",
          },
          {
            label: "No Obligation to Hire",
            text: "You are under absolutely no obligation to retain, hire, or utilize any vendor, attorney, or professional recommended or introduced by 833PROBAID®. The decision to hire any third-party professional is entirely your choice and responsibility. You can never hold the Company liable for the recommendations provided. All agreements, contracts, and financial payments are strictly between you and the respective third-party provider.",
          },
        ],
      },
    ],
  },
  {
    id: "handling-of-funds",
    title: "Handling of Funds",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® does NOT hold client earnest money deposits, manage estate accounts, clear debts, or process payments on your behalf to third-party vendors. All financial transactions must be securely routed through the authorized executor, administrator, trustee, conservator, retained estate attorney, or a licensed escrow and title company.",
        last: true,
      },
    ],
  },
  {
    id: "property-repairs",
    title: "Property Repairs and Concierge Services",
    blocks: [
      {
        type: "p",
        text: "We may assist in coordinating physical preparation services such as repairs, inspections, staging, and property cleanups. However, we are not licensed general contractors. We assume no structural or financial liability for the quality, safety, or legal compliance of any physical work performed on the property. You must independently evaluate, verify licensing for, and approve all vendor work.",
        last: true,
      },
    ],
  },
  {
    id: "property-condition",
    title: "Property Condition, Security, Access, and Information Reliance",
    blocks: [
      {
        type: "lead",
        text: "833PROBAID® relies entirely on information, access, and authority provided by the executor, trustee, conservator, attorney, or responsible estate party.",
      },
      {
        type: "p",
        text: "We assume absolutely zero responsibility or legal liability for:",
        primary: true,
      },
      {
        type: "points",
        items: [
          {
            label: "Unknown Property Conditions & Hidden Defects",
            text: "Any undisclosed or unobservable structural, environmental, or physical defects within the real estate asset.",
          },
          {
            label: "Missing Personal Property or Assets",
            text: "The security, tracking, safekeeping, or inventory of personal property, valuables, heirlooms, or vehicles located at or inside the premises.",
          },
          {
            label: "Access Limitations & Unknown Keys",
            text: "Lack of access to the property, or any unauthorized entry, trespassing, or theft resulting from third parties possessing unknown duplicate keys, garage openers, or entry codes.",
          },
          {
            label: "Inaccurate Information",
            text: "Incomplete, inaccurate, or delayed information provided to us by the estate representative or their legal counsel.",
          },
        ],
      },
      {
        type: "p",
        text: "All responsibility for property access, legal disclosures, asset security, and completeness of information remains solely with the estate representative or responsible party. It is the sole responsibility of the Executor, Administrator, or Trustee to secure the premises, change the locks if necessary, and remove or secure all personal property of value prior to listing or granting marketing access to the property.",
        last: true,
        top: "1.5rem",
      },
    ],
  },
  {
    id: "no-mediation",
    title: "No Mediation or Dispute Involvement",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® does not mediate familial disputes, resolve conflicts between competing heirs, or arbitrate beneficiary disagreements. For any interpersonal or legal estate disputes, you must seek counsel from a qualified probate attorney.",
        last: true,
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    blocks: [
      {
        type: "p",
        text: "To the fullest extent permitted by applicable law, in no event shall 833PROBAID®, its officers, directors, employees, or broker affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages whatsoever. This includes, without limitation, damages for loss of profits, estate valuation drops, missed court deadlines, uncooperative heirs, property damage caused by vendors, or data breaches, arising out of your use of or inability to use this website or our services.",
        last: true,
      },
    ],
  },
  {
    id: "no-guarantee",
    title: "No Guarantee of Results",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® makes no guarantee regarding the outcome of any probate administration, trust administration, conservatorship, partition action, court confirmation proceeding, listing, marketing effort, sale, closing timeline, property valuation, offer amount, overbid, court approval, or transaction. Every estate and every court proceeding is unique. Past performance, prior transaction experience, or educational materials presented on this website do not guarantee future results.",
        last: true,
      },
    ],
  },
  {
    id: "indemnification",
    title: "Indemnification",
    blocks: [
      {
        type: "p",
        text: "You agree to indemnify, defend, and hold harmless 833PROBAID®, Tigran Mkrtchian, and Luxury Collective from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your violation of these terms, your reliance on website information, your disputes with any third-party vendors referred by us, or any claims related to hidden structural defects or missing personal property at an estate job site.",
        last: true,
      },
    ],
  },
  {
    id: "arbitration",
    title: "Mandatory Binding Arbitration & Class Action Waiver",
    blocks: [
      {
        type: "p",
        text: "PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.",
        primary: true,
      },
      {
        type: "points",
        items: [
          {
            label: "Mandatory Arbitration",
            text: "You and 833PROBAID® agree that any dispute, claim, or controversy arising out of or relating to this website, these terms, or our services shall be settled exclusively by binding, individual arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules, except that the AAA Consumer Arbitration Rules shall apply where applicable under AAA rules or applicable law. The place of arbitration shall be Los Angeles County, California, except where applicable law or the applicable AAA rules require or permit a different location or manner of proceeding. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction.",
          },
          {
            label: "Class Action Waiver",
            text: "YOU AND THE COMPANY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person's claims or otherwise preside over any form of a representative or class proceeding.",
          },
        ],
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy & Data Collection",
    blocks: [
      {
        type: "block",
        items: [
          { type: "heading", text: "Information We Collect" },
          {
            type: "p",
            text: "We collect personal information you choose to provide through our referral intake forms, registration forms, contact forms, newsletter subscriptions, property valuation submissions, vendor applications, document uploads, and other interactive website tools. This may include your name, email address, telephone number, property address, professional role or affiliation, case or matter information, court or authority status, property and occupancy information, uploaded documents, requested services, and other information voluntarily submitted in connection with a real estate matter. We also automatically collect technical data via tracking tools, including IP addresses, browser types, device information, and website usage statistics.",
            last: true,
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "Use of Information" },
          {
            type: "p",
            text: "Collected information is used exclusively to respond to your direct inquiries, deliver requested newsletters or market analyses, evaluate real estate matters, coordinate requested service vendors, and optimize website functionality. We do NOT sell, rent, or lease your personal information to third-party data brokers. Information submitted through a referral intake, vendor application, document upload, property valuation request, or other website tool may also be used to review the submission, verify or clarify information provided, communicate with appropriate parties identified in or reasonably connected with the submission, coordinate requested real estate-related services, maintain business and transaction records, protect against fraud or misuse, and comply with applicable legal, regulatory, licensing, or recordkeeping obligations.",
            last: true,
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "Information Sharing" },
          {
            type: "p",
            text: "We may share submitted information with attorneys, fiduciaries, escrow and title professionals, appraisers, probate referees, vendors, technology service providers, and other authorized or transactional parties only as reasonably necessary to evaluate, coordinate, or perform the services requested or otherwise as permitted or required by law.",
            last: true,
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "Data Security" },
          {
            type: "p",
            text: "We implement reasonable administrative and technical safeguards to secure your information. However, no data transmission over the internet can be guaranteed as completely secure. Use of this website is at your own risk.",
            last: true,
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "Cookies and “Do Not Track” Disclosures" },
          {
            type: "p",
            text: "We use tracking cookies and analytics tools to enhance user experience.",
          },
          {
            type: "points",
            items: [
              {
                label: "California Do Not Track Notice",
                text: "Because there is currently no industry or legal consensus for recognizing browser-based Do Not Track (DNT) signals, our website does not alter its data collection and tracking practices when it detects a DNT signal from your browser.",
              },
            ],
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "California Privacy Rights (CCPA/CPRA)" },
          {
            type: "p",
            text: "To the extent the California Consumer Privacy Act, as amended, applies to 833PROBAID®, California residents may have rights regarding their personal information, including rights to know, access, correct, delete, and, where applicable, limit certain uses or disclosures and opt out of the sale or sharing of personal information, subject to applicable exceptions and limitations. Requests may be submitted using the contact information listed below.",
            last: true,
          },
        ],
      },
      {
        type: "block",
        items: [
          { type: "heading", text: "Website Accuracy & Information Updates" },
          {
            type: "p",
            text: "Although we strive to maintain accurate and current information throughout this website, applicable laws, court procedures, local rules, regulations, market conditions, and real estate practices may change without notice. We make no representation or warranty that all website content, educational materials, calculators, AI-generated responses, articles, timelines, or procedural summaries are complete, current, or free from error.",
          },
          {
            type: "p",
            text: "Users are solely responsible for independently verifying information before relying upon it.",
            last: true,
          },
        ],
        marginBottom: '1rem'
      },
    ],
  },
  {
    id: "telemarketing",
    title: "Telemarketing, TCPA, and Anti-Spam Compliance (CAN-SPAM)",
    blocks: [
      {
        type: "lead",
        text: "We are strictly committed to lawful, compliant communications across all digital entry points.",
      },
      {
        type: "points",
        items: [
          {
            label: "Explicit Request for Contact",
            text: "You acknowledge and agree that submitting your information through any online form, subscription portal, contact field, QR code, or digital entry point on this website explicitly constitutes an official business inquiry and formal request for contact regarding real estate-related services. Such a request authorizes 833PROBAID® to respond regarding the specific inquiry or services requested but does not, by itself, constitute consent to receive marketing communications where separate consent is required by applicable law.",
          },
          {
            label: "Text and Voice Consent (TCPA)",
            text: "Where you separately provide the consent required by applicable law, you expressly authorize 833PROBAID® to send marketing telephone calls, prerecorded or artificial-voice messages, and SMS text messages to the telephone number for which consent was provided. Consent to receive marketing communications is not a condition of purchasing or receiving services. Consent may be revoked at any time through any reasonable method permitted by applicable law. Opt-Out: You may opt out of text messages at any time by replying STOP. For help, reply HELP. 833PROBAID® will honor applicable opt-out and Do Not Call requirements in accordance with applicable law.",
          },
          {
            label: "Email Marketing (CAN-SPAM Act)",
            text: "By checking a subscription box or submitting your email for updates, newsletters, or reports, you consent to receive periodic marketing emails. We do not transmit misleading headers or subject lines. Opt-Out: You may unsubscribe from our digital newsletters at any time by clicking the “Unsubscribe” link located at the bottom of our emails.",
          },
        ],
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Disclaimer",
    blocks: [
      {
        type: "p",
        text: "Cybercrime, including wire fraud and email phishing, is a persistent threat in real estate transactions. 833PROBAID® will never instruct you via email or text to wire funds or transfer estate money. Always verbally verify any financial or escrow wiring instructions via a secure, known telephone number before sending funds. We are not liable for financial losses resulting from intercepted internet communications or third-party cyber threats beyond our operational control.",
        last: true,
      },
    ],
  },
  {
    id: "fair-housing",
    title: "Fair Housing & Equal Opportunity Compliance",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® operates in strict compliance with the Federal Fair Housing Act, the California Fair Employment and Housing Act (FEHA), and all applicable state and local anti-discrimination regulations. We are fully committed to equal housing opportunities. We do not discriminate, deny services, or alter transaction structures based on race, color, religion, sex, handicap, familial status, national origin, sexual orientation, gender identity, source of income, or any other legally protected classification.",
        last: true,
      },
    ],
  },
  {
    id: "dmca",
    title: "Digital DMCA Copyright Takedown Policy",
    blocks: [
      {
        type: "p",
        text: "We respect the intellectual property rights of content creators. If you believe that any image, text, or documentation hosted on this website infringes upon an active copyright, you may submit a formal Digital Millennium Copyright Act (DMCA) Takedown Notice to our listed contact address. Your notice must include a physical or electronic signature of the copyright owner, identification of the infringed work, specific location details of the material on our platform, and your direct contact channels.",
        last: true,
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® is a registered service brand. All materials, including digital books, guides, flyers, checklists, written content, proprietary consultation systems, and custom graphics on this website are protected under applicable United States copyright, trademark, and related intellectual property laws.",
      },
      {
        type: "p",
        text: "This includes, but is not limited to, the 833PROBAID® name, logo, digital domains, the registered (833) PROBAID vanity telephone number, and associated brand assets, including the overall visual presentation, design elements, and distinctive teal and orange color scheme used in connection with the 833PROBAID® registered mark.",
      },
      {
        type: "p",
        text: "Access to downloadable resources is restricted to executors, administrators, trustees, conservators, and legal professionals actively involved in estate-related real property matters. These materials are provided for informational use only in connection with such matters.",
      },
      {
        type: "p",
        text: "Any unauthorized reproduction, competitor duplication, commercial scraping, or distribution of this content without prior written permission is strictly prohibited.",
        last: true,
      },
    ],
  },
  {
    id: "licensing-disclosure",
    title: "Professional Designation and Licensing Disclosure",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® is a proprietary consumer brand providing real estate marketing and support services. All licensed real estate activities and brokerage services are legally conducted and supervised by:",
      },
      {
        type: "points",
        items: [
          {
            label: "Tigran Mkrtchian",
            text: "California Department of Real Estate (DRE) License #01728195",
          },
          {
            label: "Brokerage Affiliation: Luxury Collective",
            text: "California DRE Brokerage License #02246966",
          },
        ],
      },
    ],
  },
  {
    id: "third-party-software",
    title: "Third-Party Software Integrations & Plugins",
    blocks: [
      {
        type: "p",
        text: "This website may incorporate embedded applications, calculators, lead capture forms, analytics services, APIs, and other digital tools provided by third-party software vendors, including but not limited to WordPress plugins, hosting providers, analytics platforms, and related technology services. 833PROBAID® does not own, develop, engineer, or maintain the underlying code for these third-party technologies. To the fullest extent permitted by applicable law, 833PROBAID® shall not be responsible for software errors, service interruptions, security vulnerabilities, data loss, unauthorized access, calculation inaccuracies, or other failures arising from third-party software, platforms, or providers beyond our reasonable control.",
        last: true,
      },
    ],
  },
  {
    id: "external-websites",
    title: "External Websites & Third-Party Links",
    blocks: [
      {
        type: "p",
        text: "This website may contain links to third-party websites, software platforms, social media pages, calculators, mapping services, government agencies, or other external resources for your convenience. 833PROBAID® does not own, control, endorse, monitor, or guarantee the accuracy, availability, security, privacy practices, or content of any third-party website. Your use of any external website is entirely at your own risk and subject to that website's own terms and privacy policies.",
        last: true,
      },
    ],
  },
  {
    id: "court-supervision",
    title: "Applicable Court Supervision & Order Compliance",
    blocks: [
      {
        type: "p",
        text: "You acknowledge that many real estate assets marketed by 833PROBAID® are under the jurisdiction of the California Probate Court, Family Law Court, or Bankruptcy Court. We act in strict accordance with formal instructions issued by the appointed Fiduciary and the corresponding court orders. We are not responsible for delays, cancellations, or transaction restructures ordered by a presiding judge, referee, or governing legal authority.",
        last: true,
      },
    ],
  },
  {
    id: "solicitation-declaration",
    title: "Solicitation Declaration to Competing Licensees",
    blocks: [
      {
        type: "p",
        text: "This website is a consumer marketing and educational platform. If your real estate asset is currently listed exclusively for sale with another licensed real estate brokerage, this website's content is not intended as an active solicitation of that listing.",
        last: true,
      },
    ],
  },
  {
    id: "unsubscribe",
    title: "Unsubscribe Mandate and Liability Waiver",
    blocks: [
      {
        type: "p",
        text: "If you no longer wish to receive digital alerts, newsletters, text messages, or transaction updates from us, you may unsubscribe at any time by clicking the “Unsubscribe” link included in our emails or by replying STOP to our text messages. Once your request is processed, we will honor your communication preferences in accordance with applicable law.",
        last: true,
      },
    ],
  },
  {
    id: "unsolicited-subscriptions",
    title: "Unsolicited Subscriptions & Malicious Sign-Ups",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® uses standard verification protocols, but we do not control who enters information into our public website forms. If a third party, hostile heir, or malicious actor submits your email address or phone number without your knowledge or consent, 833PROBAID® shall not be responsible or liable for any resulting automated confirmation messages or communications. Your sole remedy is to click the “Unsubscribe” link or reply STOP, as applicable.",
        last: true,
      },
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Severability",
    blocks: [
      {
        type: "p",
        text: "These terms shall be governed by, construed, and enforced in accordance with the laws of the State of California, without regard to conflict of law principles. If any provision of these terms is found to be invalid or unenforceable by an arbitrator or court of competent jurisdiction, the remaining provisions shall continue in full legal force and effect.",
        last: true,
      },
    ],
  },
  {
    id: "availability-of-services",
    title: "Availability of Services",
    blocks: [
      {
        type: "p",
        text: "833PROBAID® reserves the right, in its sole discretion, to decline representation, refuse service, discontinue discussions, terminate communications, or decline participation in any transaction or matter where permitted by applicable law.",
        last: true,
      },
    ],
  },
  {
    id: "modifications",
    title: "Modifications",
    blocks: [
      {
        type: "p",
        text: "We reserve the explicit right to modify, alter, or update these terms and privacy protocols at any time without prior individual notice. Updates will be effective immediately upon publication to this page.",
        last: true,
      },
    ],
    marginBottom: '0rem'
  },
];
