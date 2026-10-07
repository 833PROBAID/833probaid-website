"use client";

import toolAccessApi from "@/app/lib/api/toolAccess";
import { markToolAccessGranted } from "@/app/lib/toolAccessGrant";
// import { hasFreshToolAccessGrant } from "@/app/lib/toolAccessGrant";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToolAccessModal from "@/components/ToolAccessModal";
import { Landmark } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
// import { useLayoutEffect } from "react";

const shellShadow =
  "rgba(0, 0, 0, 0.5) 0px 8px 12px, rgba(0, 0, 0, 0.7) 0px -5px 12px 1px";
const heroPanelShadow =
  "rgba(0, 0, 0, 0.5) 5px 7px 12px 10px,rgba(255, 255, 255, 0.25) 2.46px 3.46px 3.64px 0px inset,rgba(0, 0, 0, 0.25) -2.64px -3.55px 3.64px 0px inset";
const heroPanelShadow2 =
  "rgba(0, 0, 0, 0.4) 0px -2px 3px,rgba(0, 0, 0, 0.8) 0px 2px 5px 1px,rgba(255, 255, 255, 0.25) 5.46px 5.46px 3.64px 0px inset,rgba(0, 0, 0, 0.25) -3.64px -4.55px 3.64px 0px inset";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const parseAmount = (value) => {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildOverbid = (acceptedOffer) => {
  const firstTierBase = Math.min(acceptedOffer, 10000);
  const firstTierIncrease = firstTierBase * 0.1;
  const remainingBalance = Math.max(acceptedOffer - 10000, 0);
  const remainingIncrease = remainingBalance * 0.05;
  const requiredIncrease = firstTierIncrease + remainingIncrease;

  return {
    acceptedOffer,
    firstTierIncrease,
    remainingBalance,
    remainingIncrease,
    requiredIncrease,
    minimumOverbid: acceptedOffer + requiredIncrease,
  };
};

const ServiceLayout = ({
  children,
  title,
  description,
  mainHeading,
  logoImage,
  offerPrice,
  toolPage = "court-confirmation-overbid-calculator",
  panelTitle,
  panelValue,
  panelDetail,
}) => {
  // TEMPORARY: start granted so the tool page shows for UI work.
  const [access, setAccess] = useState("granted");
  const [accessOpen, setAccessOpen] = useState(false);
  const verifiedRef = useRef(false);

  const grantAccess = () => {
    verifiedRef.current = true;
    markToolAccessGranted();
    setAccessOpen(false);
    setAccess("granted");
  };

  // TEMPORARY: skip the access popup and show the tool.
  // useLayoutEffect(() => {
  //   if (hasFreshToolAccessGrant()) setAccess("granted");
  // }, []);
  //
  // useEffect(() => {
  //   let cancelled = false;
  //   toolAccessApi
  //     .session()
  //     .then((session) => {
  //       if (cancelled) return;
  //       if (session?.authorized || verifiedRef.current || hasFreshToolAccessGrant()) {
  //         setAccess("granted");
  //         setAccessOpen(false);
  //         return;
  //       }
  //       setAccess("required");
  //       setAccessOpen(true);
  //     })
  //     .catch(() => {
  //       if (cancelled) return;
  //       if (verifiedRef.current || hasFreshToolAccessGrant()) {
  //         setAccess("granted");
  //         setAccessOpen(false);
  //         return;
  //       }
  //       setAccess("required");
  //       setAccessOpen(true);
  //     });
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [toolPage]);

  useEffect(() => {
    if (access !== "granted") return;
    toolAccessApi.recordUse(toolPage).catch(() => {});
  }, [access, toolPage]);

  const acceptedOffer = parseAmount(offerPrice);
  const hasOffer = acceptedOffer > 0;
  const results = useMemo(() => buildOverbid(acceptedOffer), [acceptedOffer]);

  const resolvedPanelTitle = panelTitle ?? "Minimum INITIAL Overbid";
  const resolvedPanelValue =
    panelValue ??
    (hasOffer ? formatCurrency(results.minimumOverbid) : "Ready to calculate?");
  const resolvedPanelDetail =
    panelDetail ??
    (hasOffer ? (
      `Required overbid increase ${formatCurrency(results.requiredIncrease)}`
    ) : (
      <>
        Enter the <span className="">Accepted Offer</span> and every other line
        updates automatically.
      </>
    ));

  if (access !== "granted") {
    return (
      <div>
        <Navbar />
        <section className="flex min-h-[60vh] items-center justify-center px-4 py-16 font-montserrat">
          <div className="max-w-xl text-center">
            <h1 className="text-3xl font-black text-primary">
              {access === "checking" ? "Checking access" : "Verify to use this tool"}
            </h1>
            <p className="mt-3 text-lg font-bold text-slate-800">
              {access === "checking"
                ? "Confirming your tool access session."
                : "Enter your name, email, and phone, then the code we send to your email."}
            </p>
            {access === "required" ? (
              <button
                type="button"
                onClick={() => setAccessOpen(true)}
                className="mt-6 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white"
              >
                Verify access
              </button>
            ) : null}
          </div>
        </section>
        <ToolAccessModal
          isOpen={access === "required" && accessOpen}
          toolPage={toolPage}
          onClose={() => setAccessOpen(false)}
          onVerified={grantAccess}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="min-h-screen py-8 sm:py-12 lg:py-16 font-montserrat">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="overflow-clip rounded-3xl group hover:translate-y-[-5px] hover:![box-shadow:rgba(0,0,0,0.6)_0px_12px_20px,rgba(0,0,0,0.7)_0px_-8px_16px_2px]"
            style={{ boxShadow: shellShadow }}
          >
            <div
              className="relative overflow-hidden p-6 sm:p-8 lg:p-10 rounded-t-[24px] border-[3px] border-b-0 border-[#0f1417]"
              style={{
                background:
                  "linear-gradient(165deg, #26808d 0%, #13707f 28%, #065b6a 58%, #034653 100%)",
                boxShadow:
                  "rgba(0, 0, 0, 0.4) 0px 4px 3px, rgba(255,255,255,0.4) 4px 4px 5px inset, rgba(0,0,0,0.4) -6px -6px 5px inset",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.22) 1.4px, transparent 1.5px)",
                  backgroundSize: "11px 11px",
                  maskImage:
                    "radial-gradient(85% 105% at 100% 78%, #000 0%, rgba(0,0,0,0.6) 45%, transparent 80%)",
                  WebkitMaskImage:
                    "radial-gradient(85% 105% at 100% 78%, #000 0%, rgba(0,0,0,0.6) 45%, transparent 80%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 h-[87px] w-[87px]"
                style={{
                  background:
                    "linear-gradient(200deg, #fe7701 0%, #fe7701 45%, #9e5220 100%)",
                  clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                }}
              />
              <div className="relative flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
                <div className="flex-1">
                  <div
                    className="inline-flex items-center gap-3 rounded-xl py-3 pr-5 pl-3"
                    style={{
                      background:
                        "linear-gradient(180deg, #f7ac46 0%, #fe7701 52%, #fe7701 100%)",
                      boxShadow:
                        "inset 3px 4px 1px rgba(255,255,255,0.25), inset -3px -2px 2px 2px rgba(0,0,0,0.45), 0 0 6px 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
                      <Landmark
                        className="h-7 w-7 text-secondary"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className="font-extrabold tracking-[1.5px] text-white uppercase text-[24px]"
                      style={{ textShadow: "0 2px 2px rgba(0,0,0,0.45)" }}
                    >
                      {title}
                    </span>
                  </div>
                  <h1
                    className="mt-8 max-w-[43rem] text-[30px] leading-[1.12] font-bold tracking-[-2px] text-white sm:text-[38px] xl:text-[44px]"
                    style={{
                      filter: "drop-shadow(2px 3px 0px rgba(0,0,0,0.5))",
                    }}
                  >
                    {mainHeading}
                  </h1>
                  <div className="mt-8 border-l-4 border-secondary pl-6">
                    <p
                      className="max-w-[30rem] text-[16px] leading-[1.6] text-white/95 sm:text-[18px] font-bold"
                      style={{
                        filter: "drop-shadow(1px 2px 0px rgba(0,0,0,0.4))",
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
                <div className="w-full xl:w-[29rem] xl:shrink-0">
                  <div
                    className="group/second relative rounded-3xl px-2 pt-2 pb-2 backdrop-blur-sm hover:-translate-y-1.25 hover:![box-shadow:rgba(0,0,0,0.8)_5px_7px_12px_10px,rgba(255,255,255,0.25)_2.46px_3.46px_3.64px_0px_inset,rgba(0,0,0,0.25)_-2.64px_-3.55px_3.64px_0px_inset]"
                    style={{
                      background:
                        "linear-gradient(150deg, #3397a3 0%, #0f707f 50%, #045665 100%)",
                      boxShadow: heroPanelShadow,
                    }}
                  >
                    <div
                      className="relative rounded-[20px] px-6 pt-6 pb-8 backdrop-blur-sm"
                      style={{
                        background:
                          "linear-gradient(165deg, #1a8b9a 0%, #0f707f 35%, #065765 65%, #045665 100%)",
                        boxShadow: heroPanelShadow2,
                      }}
                    >
                      <div className="p-2 w-max rounded-full bg-[linear-gradient(to_bottom,white_0%,rgb(255,180,100)_15%,rgb(254,119,2)_70%,rgb(254,119,2)_100%)] [box-shadow:0px_4px_6px_5px_rgba(0,0,0,0.7)] absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/4">
                        <div className="bg-secondary w-max p-5 rounded-full shadow-[inset_0px_0px_12px_rgba(0,0,0,0.5)]">
                          <img
                            src={logoImage}
                            className="w-14 h-14 [box-shadow:0px_0px_5px_2px_rgba(0,0,0,0.7)] rounded-lg group-hover/second:-rotate-12 duration-200"
                          />
                        </div>
                      </div>
                      <div
                        className="mt-20 flex items-center justify-center gap-3 sm:gap-5"
                        style={{
                          filter: "drop-shadow(1px 2px 0px rgba(0,0,0,0.45))",
                        }}
                      >
                        <span className="h-[3px] w-10 min-w-0 shrink rounded-full bg-secondary" />
                        <h2 className="text-center text-[15px] font-bold tracking-[1px] whitespace-nowrap text-secondary uppercase sm:text-[19px] sm:tracking-[2px]">
                          {resolvedPanelTitle}
                        </h2>
                        <span className="h-[3px] w-10 min-w-0 shrink rounded-full bg-secondary" />
                      </div>
                      <p
                        className="mt-2 text-center text-[30px] leading-[1.15] font-bold text-white sm:text-[38px]"
                        style={{
                          filter: "drop-shadow(2.5px 3px 0px rgba(0,0,0,0.5))",
                        }}
                      >
                        {resolvedPanelValue}
                      </p>
                      <div
                        className="mx-auto mt-4 h-[3px] w-[60px] rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #e8752a 0%, #ffe6c4 50%, #e8752a 100%)",
                          boxShadow: "0 0 10px 2px rgba(254,140,40,0.65)",
                        }}
                      />
                      <p
                        className="mt-4 text-center text-[16px] leading-[1.6] text-white/95 sm:text-[18px] font-bold"
                        style={{
                          filter: "drop-shadow(1px 2px 0px rgba(0,0,0,0.4))",
                        }}
                      >
                        {resolvedPanelDetail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-gray-50 to-gray-100 p-10 border-[3px] border-t-0 border-secondary rounded-b-[24px]">
              {children}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServiceLayout;
