"use client";
import appointmentMonth from '@/../public/assets/agendamneto-mensal.png';
import config from '@/../public/assets/config.png';
import dashboard from '@/../public/assets/dashboard.png';
import daily from '@/../public/assets/lancamento-diario.png';
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import { Link } from '@/i18n/navigation';
import { useTranslations } from "next-intl";

const HeroParallax = ({
  products,
}: {
  products: {
    titleKey: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.titleKey}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.titleKey}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.titleKey}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const t = useTranslations('hero.heroParallax');

  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-primary">
        {t('title')} <br /> {t('subtitle')}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        {t('description')}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    titleKey: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  const t = useTranslations('hero.products');

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={t(product.titleKey)}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {t(product.titleKey)}
      </h2>
    </motion.div>
  );
};

function HeroParallaxSection() {
  const products = [
    { titleKey: "dailyEntry", link: "/finance/daily", thumbnail: daily.src },
    { titleKey: "dashboard", link: "/finance", thumbnail: dashboard.src },
    { titleKey: "configure", link: "/account/appearance", thumbnail: config.src },
    { titleKey: "scheduling", link: '/calendar/month-view', thumbnail: appointmentMonth.src },
    { titleKey: "dailyEntry", link: "/finance/daily", thumbnail: daily.src },
    { titleKey: "dashboard", link: "/finance", thumbnail: dashboard.src },
    { titleKey: "configure", link: "/account/appearance", thumbnail: config.src },
    { titleKey: "scheduling", link: '/calendar/month-view', thumbnail: appointmentMonth.src },
    { titleKey: "dailyEntry", link: "/finance/daily", thumbnail: daily.src },
  ];

  return (
    <div className="relative min-h-[1750px] md:min-h-[2000px] w-full z-1">
      <div className="absolute top-0 left-0 w-full">
        <HeroParallax products={products} />
      </div>
    </div>
  );
}

export { HeroParallaxSection };

