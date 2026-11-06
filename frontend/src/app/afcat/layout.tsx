import LearnerModeKeeper from "@/components/layout/LearnerModeKeeper";

/** AFCAT pages remember AFCAT mode so "Home" keeps the learner inside AFCAT. */
export default function AfcatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LearnerModeKeeper />
    </>
  );
}
