import LifecycleTabs from "./solutions/LifecycleTabs";
import { WordRevealGroup, Words } from "@/components/ui/WordReveal";
import styles from "./solutions/Solutions.module.css";

export function Solutions() {
  return (
    <section
      className={styles.solutions}
      id="solutions"
      data-nav-theme="light"
      data-name="Solutions Section"
    >
      <div className={styles.container}>
        {/* Section heading */}
        <WordRevealGroup className={styles.header}>
          <p className={styles.eyebrow}>Solutions</p>
          <h2 className={styles.heading}>
            <Words text="Built for the full borrower lifecycle." />
          </h2>
          <p className={styles.subheading}>
            <Words text="Two sides of your business. One platform." />
          </p>
        </WordRevealGroup>

        <LifecycleTabs />
      </div>
    </section>
  );
}
