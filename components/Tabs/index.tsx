import React, { ReactNode } from "react";
import styles from './tabs.module.css'

type TabLabelProps = {
  label: string;
  active?: boolean;
  onClick?: () => any;
};
export const TabLabel = ({ label, active, onClick }: TabLabelProps) => {
  return (
    <div onClick={onClick} className={`${styles.tab_label} ${active ? styles.tab_label_active : ''}`}>
      <span>{label}</span>
    </div>
  );
};

type TabsProps = {
  labels: string[];
  currentTab: number;
  onChange?: (val: number) => any;
};
export const Tabs = ({ labels, currentTab, onChange }: TabsProps) => {
  return (
    <div className={styles.tabs}>
      {labels.map((label, idx) => (
        <TabLabel key={label} label={label} active={currentTab === idx} onClick={() => {
            onChange && onChange(idx)
        }} />
      ))}
    </div>
  );
};

type TabPanelProps = {
  children: ReactNode;
  tabIndex: number;
  currentTab: number;
};
export const TabPanel = ({ children, tabIndex, currentTab }: TabPanelProps) => {
  return <>{tabIndex === currentTab ? <div>{children}</div> : null}</>;
};
