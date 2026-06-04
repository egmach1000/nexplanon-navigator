import { useState } from "react";
import {
  PageHeading,
  ServiceBanner,
  SiteFooter,
  SiteHeader,
  TopUtilityBar,
} from "./components/site/SiteChrome";
import { ProductTabs } from "./components/site/ProductTabs";
import { NexplanonTab } from "./components/site/NexplanonTab";
import { MobileBottomNav } from "./components/site/MobileBottomNav";
import { NavigatorModal } from "./components/navigator/NavigatorModal";
import styles from "./App.module.css";

export default function App() {
  const [activeProduct, setActiveProduct] = useState("NEXPLANON");
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  return (
    <div className={styles.app}>
      <TopUtilityBar />
      <SiteHeader />
      <ServiceBanner />
      <PageHeading title="Product Resources" />
      <ProductTabs active={activeProduct} onChange={setActiveProduct} />

      {activeProduct === "NEXPLANON" ? (
        <NexplanonTab onLaunch={() => setNavigatorOpen(true)} />
      ) : (
        <div className={styles.otherProduct}>
          <p>
            {activeProduct} resources are available on the production site. This
            prototype focuses on the NEXPLANON tab.
          </p>
        </div>
      )}

      <SiteFooter />

      <MobileBottomNav />

      <NavigatorModal open={navigatorOpen} onClose={() => setNavigatorOpen(false)} />
    </div>
  );
}
