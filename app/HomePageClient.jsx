"use client";

import dynamic from "next/dynamic";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Navbar";
import AnimatedText from "../components/AnimatedText";
import { toolsCardData, trustCardData } from "../public/data/Tools";
import Image from "next/image";
import Link from "next/link";
import HomeBooksMobileShowcaseClient from "@/components/HomeBooksMobileShowcaseClient";
import BookCardBig from "./new-page/BookCardBig";
import BookCardGrid from "./new-page/BookCardGrid";
import useIsMobile from "@/hooks/useIsMobile";

const Footer = dynamic(() => import("../components/Footer"));
const HomeCard = dynamic(() => import("../components/HomeCard"));
const HomeCardBig = dynamic(() => import("../components/HomeCardBig"));
const ToolsCard = dynamic(() => import("../components/ToolsCard"));
const TrustCard = dynamic(() => import("../components/TrustCard"));
const ReadyToGetStart = dynamic(() => import("@/components/ReadyToGetStart"));

export default function HomePageClient({ initialHomeCardData = [] }) {
  const isMobile = useIsMobile();
  const homeCardData = Array.isArray(initialHomeCardData)
    ? initialHomeCardData
    : [];
  const sectionContainerClass =
    "mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-0";
  return (
    <>
      <Navbar />
      <section className="w-full">
        <Hero />
        <section className={`${sectionContainerClass} mt-28`}>
          <h1 className="font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
            <AnimatedText
              text="If The Court Touches It,"
              as="div"
              animate={true}
            />
            <AnimatedText
              text="833PROBAID® Runs It"
              className="text-secondary"
              animate={true}
              top="-0.25em"
              fontSize="0.7em"
            />
          </h1>
          <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            <p className="font-montserrat text-center font-medium text-[16px] md:text-xl lg:text-2xl">
              <AnimatedText
                className="text-primary font-extrabold"
                text="833PROBAID® "
                animate={false}
                top="2px"
              />
              <AnimatedText
                text="runs a proprietary, court-aligned system built exclusively for probate, trust, and conservatorship real estate. Every case is pushed through a controlled workflow engineered to eliminate confusion, force clarity, and keep the entire process in lockstep with the court — from the first intake call to the final recording. No templates. No shortcuts. No guesswork. Just structure, precision, and full alignment with the way court-supervised real estate is meant to run."
                animate={false}
              />
            </p>
          </div>
          <div className="mt-6 grid w-full grid-cols-2 gap-2 sm:gap-4 md:mt-8">
            <Image
              src="/home/1.svg"
              className="w-full transition-transform duration-500 ease-out md:hover:scale-105 md:hover:-rotate-1 cursor-pointer"
              style={{ willChange: "transform" }}
              alt="house image"
              width={1000}
              height={1000}
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 45vw, 40vw"
            />
            <Image
              src="/home/2.svg"
              className="w-full transition-transform duration-500 ease-out md:hover:scale-105 md:hover:rotate-1 cursor-pointer"
              style={{ willChange: "transform" }}
              alt="house image"
              width={1000}
              height={1000}
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 45vw, 40vw"
            />
          </div>
        </section>
        <section
          className={`${sectionContainerClass} mt-10 md:mt-14 lg:mt-16 xl:mt-20`}
        >
          <h1 className="font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col justify-center items-center gap-1 sm:gap-4">
            <AnimatedText
              text="The System Attorneys Rely On"
              as="div"
              animate={true}
            />
            <div className="text-secondary">
              <AnimatedText
                text="When The Estate Can't Afford Mistakes"
                animate={true}
              />
            </div>
          </h1>

          <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            <p className="font-montserrat text-center font-medium text-[15.8px] md:text-xl lg:text-2xl">
              <AnimatedText
                text="Attorneys, fiduciaries, and executors rely on"
                animate={false}
              />
              <AnimatedText
                text=" 833PROBAID® "
                className="text-primary font-extrabold"
                animate={false}
              />
              <AnimatedText
                text="for one reason — consistency that outperforms the industry. Files stay clean. Communication stays tight. Deadlines are honored. Documentation is complete. And every case moves forward through a level of organization most agents simply aren't equipped to deliver. This is disciplined execution in its purest form — the standard every court-supervised sale should have, but almost none do."
                animate={false}
              />
            </p>
          </div>
          {!isMobile && (
            <section className="mx-auto w-full  grid-cols-1 place-items-center justify-center px-2 md:px-16 lg:px-22 xl:px-30 sm:grid ">
              {homeCardData.slice(0, 1).map((card, index) => (
                <BookCardBig
                  key={card.id}
                  title={card.title}
                  subtitle={card.subtitle}
                  description={card.description}
                  imageSrc={card.imageSrc}
                  icon={card.icon}
                  slug={card.slug}
                  mirrored={index % 2 !== 0}
                  speed={3000}
                  priority={true}
                />
              ))}
            </section>
          )}
          <BookCardGrid
            cards={isMobile ? homeCardData : homeCardData.slice(1)}
          />

          {/* Desktop: Always show last big card */}
          {/* <div className="mt-4 hidden text-white sm:mt-10 md:mt-14 sm:block">
            {homeCardData.length > 1 && (
              <div className="flex w-full justify-center">
                <div className="w-full">
                  <HomeCardBig
                    uid={`${homeCardData[homeCardData.length - 1].id}-big-desktop-last`}
                    icon={homeCardData[homeCardData.length - 1].icon}
                    title={homeCardData[homeCardData.length - 1].title}
                    subtitle={homeCardData[homeCardData.length - 1].subtitle}
                    description={
                      homeCardData[homeCardData.length - 1].description
                    }
                    slug={homeCardData[homeCardData.length - 1].slug}
                    bannerImage={homeCardData[homeCardData.length - 1].image}
                  />
                </div>
              </div>
            )}
          </div> */}
        </section>
        <section className={sectionContainerClass}>
          <div className="my-8 grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:my-10 md:flex-row lg:my-14 lg:gap-8 xl:my-16">
            <Image
              src="/images/house3.png"
              className="w-full transition-transform duration-500 ease-out hover:scale-105 cursor-pointer"
              style={{ willChange: "transform" }}
              loading="lazy"
              alt="house"
              width={1000}
              height={1000}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="flex flex-col justify-center">
              <h1 className="font-anton text-center text-2xl leading-[1.08] md:text-3xl lg:text-4xl xl:text-[46px] flex flex-col justify-center items-center gap-1 sm:gap-2">
                <AnimatedText
                  text="Selling a Probate, Trust, or"
                  className="text-header"
                  as="div"
                  animate={true}
                />
                <AnimatedText
                  text="Conservatorship Property?"
                  className="text-secondary"
                  as="div"
                  animate={true}
                />
              </h1>

              <h4 className="font-montserrat text-primary mt-3 text-center text-lg leading-snug font-extrabold lg:text-xl xl:text-2xl">
                <AnimatedText
                  text="We Handle the Sale—From Authority to Closing."
                  animate={false}
                />
              </h4>
              <div className="mt-3">
                <p className="font-montserrat text-center font-medium leading-relaxed text-pretty text-[15.8px] md:text-lg lg:text-xl">
                  <AnimatedText
                    text="Whether you're administering a probate, managing a trust, or handling a conservatorship property, we understand that you already have enough on your plate. Once authority is established, "
                    animate={false}
                  />{" "}
                  <AnimatedText
                    text=" 833PROBAID® "
                    className="text-primary font-extrabold"
                    animate={false}
                  />
                  <AnimatedText
                    text=" takes control of the real estate sale—from property preparation and pricing to marketing, negotiations, court requirements when applicable, and closing. Whether the estate needs a faster cash solution or the property should be positioned for maximum market value, we'll help you choose and execute the strategy that best serves the estate. One property. One controlled process. One less thing for you to manage."
                    animate={false}
                  />
                </p>
                <h4 className="font-montserrat text-primary text-center text-lg font-extrabold tracking-wide lg:text-xl xl:text-2xl mt-4">
                  <AnimatedText text="Fast" />
                  <span className="text-secondary">.</span>{" "}
                  <AnimatedText text="Fair" />
                  <span className="text-secondary">.</span>{" "}
                  <AnimatedText text="Done" />
                  <span className="text-secondary">.</span>
                </h4>
              </div>
            </div>
          </div>
        </section>
        <section className={sectionContainerClass}>
          <div className="mt-10">
            <ReadyToGetStart />
          </div>
        </section>
        <section
          className={`${sectionContainerClass} py-10 md:py-12 lg:py-14 xl:py-15`}
        >
          <h1 className="font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl">
            <AnimatedText text="Probate Risk. " animate={true} />
            <AnimatedText
              text="Identify It Before It Becomes a Problem."
              className="text-secondary"
              animate={true}
            />
          </h1>
          <div className="my-6">
            <p className="font-montserrat text-center font-medium text-[15.8px] md:text-xl lg:text-2xl">
              <AnimatedText text="Court-supervised sales leave little room for surprises. These tools expose risk, calculate critical requirements, and test readiness before problems reach the property, the transaction, or the court." />
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-10">
            {toolsCardData.map((item, index) => (
              <ToolsCard
                key={item.id}
                id={item.id}
                index={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                href={item.href}
              />
            ))}
          </div>
        </section>

        <section className={sectionContainerClass}>
          <div className="mb-5 sm:mb-10">
            <h1 className="font-anton text-center text-2xl md:text-3xl lg:text-4xl xl:text-6xl flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3">
              <AnimatedText text="Thank You" as="div" animate={true} />
              <div className="flex gap-1.5">
                <AnimatedText
                  text=" for Trusting Us"
                  className="text-secondary"
                  as="div"
                  animate={true}
                />
              </div>
            </h1>
          </div>
          <div className="space-y-7 sm:space-y-10">
            {trustCardData.map((item, index) => {
              return (
                <TrustCard
                  key={item.serial}
                  text={item.text}
                  serial={item.serial}
                  addition={
                    index === 3 ? (
                      <>
                        <br />
                        <AnimatedText
                          text="If The Court Touches It, "
                          animate={true}
                          className="text-secondary"
                        />
                        <AnimatedText
                          text="833PROBAID®"
                          className="text-primary"
                          animate={true}
                        />
                        <AnimatedText
                          text=" Runs It."
                          animate={true}
                          className="text-secondary"
                        />
                      </>
                    ) : index === 2 ? (
                      <>
                        <AnimatedText
                          text="833PROBAID®"
                          className="text-primary"
                          animate={true}
                        />
                        <AnimatedText
                          text=" to deliver the structured, high-level infrastructure that court-supervised real estate demands and estate representatives deserve."
                          animate={true}
                        />
                      </>
                    ) : (
                      <></>
                    )
                  }
                />
              );
            })}
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}
