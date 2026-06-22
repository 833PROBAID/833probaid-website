export default function BlogHero({
  bannerImage,
  title,
  authorName,
  authorAvatar,
  wrapperStyle = {},
  isCard = false,
  mirrored = false,
}) {
  return (
    <div
      className="w-full aspect-[1670/1300] sm:aspect-[1670/1098]"
      style={{
        position: "relative",
        containerType: "inline-size",
        ...wrapperStyle,
      }}
    >
      {/* Outer shadow wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          // borderRadius: "24px",
          // boxShadow: "0px 0px 25px rgba(0,0,0,0.75)",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 78%, 83% 100%, 0% 100%)",
        }}
      />

      {/* Teal background card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0097A7",
          clipPath:
            isCard && !mirrored
              ? "polygon(0% 0%, 100% 0%, 100% 89%, 87% 100%, 0% 100%)"
              : isCard && mirrored
                ? "polygon(0% 0%, 100% 0%, 100% 0%, 100% 100%, 13% 100%, 0% 89%)"
                : "polygon(0% 0%, 100% 0%, 100% 78%, 83% 100%, 0% 100%)",
        }}
      />

      {/* White inner card */}
      <div
        style={{
          position: "absolute",
          left: isCard ? "3.5%" : "2.5%",
          top: isCard ? "2.5%" : "3.5%",
          right: isCard ? "3.5%" : "2.5%",
          bottom: isCard ? "2.5%" : "3.5%",
          filter: "drop-shadow(0px 0px 15px rgba(0,0,0,0.9))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "white",
            clipPath:
              isCard && !mirrored
                ? "polygon(0% 0%, 100% 0%, 100% 90%, 88% 100%, 0% 100%)"
                : isCard && mirrored
                  ? "polygon(0% 0%, 100% 0%, 100% 78%, 100% 100%, 0% 100%, 12% 100%, 0% 90%)"
                  : "polygon(0% 0%, 100% 0%, 100% 78%, 83% 100%, 0% 100%)",
          }}
          className={ isCard ? "rounded-lg md:rounded-[18px]" : "rounded-[18px]" }
        />
      </div>

      {/* Banner Image */}
      <div
        style={{
          position: "absolute",
          left: isCard ? "9.46%" : "5%",
          top: isCard ? "6.5%" : "7.35%",
          width: isCard ? "81.14%" : "90%",
          height: "58.29%",
          overflow: "hidden",
          boxShadow: "0px 0px 12px rgba(0,0,0,0.7)",
        }}
        className={ isCard ? "rounded-lg md:rounded-[13.4076px] border-2 md:border-4 border-[#FE7702]" : "rounded-[13.4076px] border-4 border-[#FE7702]" }
      >
        <img
          src={bannerImage}
          alt="Blog banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: isCard ? "6.59%" : "2.15%",
          top: isCard ? "67.5%" : "68.5%",
          width: "81.14%",
          padding: "0 3%",
        }}
      >
        {!isCard ? (
          <h2
            className="font-anton text-primary leading-tight"
            style={{ fontSize: "clamp(0.6rem, 2.8cqw, 2.8rem)" }}
          >
            {title}
          </h2>
        ) : (
          <h2
            className="font-anton text-primary leading-tight"
            style={{ fontSize: "clamp(0.5rem, 4.5cqw, 4rem)" }}
          >
            {title}
          </h2>
        )}
      </div>

      {/* Author */}
      <div
        style={{
          position: "absolute",
          left: isCard ? "6.59%" : "2.15%",
          top: "83%",
          width: isCard ? "100%" : "60%",
          display: "flex",
          alignItems: "center",
          gap: "2%",
          padding: "0 3%",
        }}
      >
        <img
          src={'/avatar.png'}
          alt={authorName}
          className="border-primary border-2"
          style={{
            width: isCard
            ? "clamp(20px, 7cqw, 90px)"
            : "clamp(28px, 7cqw, 90px)",
            aspectRatio: "1/1",
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            alignSelf: "right",
          }}
        />
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            color: "#333",
            fontSize: isCard
              ? "clamp(0.4rem, 3cqw, 2rem)"
              : "clamp(0.5rem, 2cqw, 1.6rem)",
            fontWeight: 600,
            lineHeight: 1.2,
            alignSelf: "center",
          }}
        >
          {authorName}
        </span>
      </div>
    </div>
  );
}
