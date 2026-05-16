export const EVENT = {
  name: "NYC Pride March 2026",
  date: "Sunday 28 June 2026",
  iso: "2026-06-28",
  contactEmail: "nycg.pd@dfat.gov.au",
} as const;

export const REHEARSALS = [
  {
    id: "2026-06-10" as const,
    label: "Wednesday 10 June",
    iso: "2026-06-10",
    time: "6:00pm – 7:00pm",
    arriveBy: "5:45pm",
  },
  {
    id: "2026-06-17" as const,
    label: "Wednesday 17 June",
    iso: "2026-06-17",
    time: "6:00pm – 7:00pm",
    arriveBy: "5:45pm",
  },
  {
    id: "2026-06-24" as const,
    label: "Wednesday 24 June",
    iso: "2026-06-24",
    time: "6:00pm – 7:00pm",
    arriveBy: "5:45pm",
  },
];

export const REHEARSAL_VENUE = {
  name: "Australian Consulate-General",
  address: "150 E 42nd Street, Floor 34, New York, NY 10017",
} as const;

export type PartnerSocial = {
  network: "instagram" | "facebook" | "linkedin";
  href: string;
};

export const PARTNERS: {
  name: string;
  href: string;
  logo: string;
  socials: PartnerSocial[];
}[] = [
  {
    name: "America Josh",
    href: "https://americajosh.com",
    logo: "/partners/america-josh.svg",
    socials: [
      { network: "instagram", href: "https://www.instagram.com/americajosh" },
      { network: "facebook", href: "https://facebook.com/americajosh" },
      { network: "linkedin", href: "https://www.linkedin.com/company/americajosh/" },
    ],
  },
  {
    name: "Australian Consulate-General New York",
    href: "https://usa.embassy.gov.au/our-locations",
    logo: "/partners/consulate.svg",
    socials: [
      { network: "instagram", href: "https://www.instagram.com/ausconsulateny/" },
      { network: "facebook", href: "https://facebook.com/australianconsulategeneralnyc/" },
      { network: "linkedin", href: "https://www.linkedin.com/showcase/ausconsulateny/" },
    ],
  },
  {
    name: "American Australian Association",
    href: "https://americanaustralian.org/",
    logo: "/partners/aaa.svg",
    socials: [
      { network: "instagram", href: "https://www.instagram.com/_aaausa/" },
      { network: "facebook", href: "https://www.facebook.com/americanaustralian" },
      { network: "linkedin", href: "https://www.linkedin.com/company/american-australian-association" },
    ],
  },
];

export const TSHIRT_OPTIONS = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "2XL", label: "2XL" },
  { value: "3XL", label: "3XL" },
] as const;

export const CAPS = {
  march: Number(process.env.MARCH_CAP ?? 200),
  rehearsal: Number(process.env.REHEARSAL_CAP ?? 50),
};
