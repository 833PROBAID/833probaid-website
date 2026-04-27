import ContactCard from "./ContactCard";
import LogoCard from "./LogoCard";
import NewsletterCard from "./NewsletterCard";

const MARQUEE_ITEMS = [
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
  "PROBATE",
  "TRUST",
  "CONSERVATORSHIP",
  "SUCCESSOR IN INTEREST",
];
export default function Footer() {
  return (
    <footer className="bg-primary/35 border-primary mt-8 border-y-2 md:mt-12">
      <div className="bg-secondary shadow-[0_-8px_12.7px_rgba(0,0,0,0.63),0_10px_12.2px_0px_rgba(0,0,0,0.63)] mt-0.5">
        <div className="footer-marquee">
          <div className="footer-marquee__track font-montserrat font-bold text-white text-[40px] lg:text-[60px] xl:text-[82px]">
            <div className="footer-marquee__group">
              {MARQUEE_ITEMS.map((item, index) => (
                <span key={item + index} className="footer-marquee__item">
                  {item}
                </span>
              ))}
            </div>
            <div className="footer-marquee__group" aria-hidden="true">
              {MARQUEE_ITEMS.map((item, index) => (
                <span
                  key={`${item + index}-copy`}
                  className="footer-marquee__item"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px]  mx-auto">
        <div className="py-8">
          <div className="font-montserrat">
            <div className="grid grid-cols-1 gap-0  lg:grid-cols-3 md:gap-1">
              <LogoCard />
              <ContactCard />
              <NewsletterCard />
            </div>
          </div>
        </div>

        <hr className="text-black/36" />
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-4 font-bold md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-secondary">
              833PROBAID
              <span
                style={{
                  verticalAlign: "super",
                  fontSize: "0.6em",
                  lineHeight: "0",
                }}
              >
                ®
              </span>
            </span>{" "}
            . All rights reserved.
          </p>
          <a className="text-secondary" href="#">
            Privacy Policy & Terms of Service/Disclosure
          </a>
        </div>
      </div>
    </footer>
  );
}
