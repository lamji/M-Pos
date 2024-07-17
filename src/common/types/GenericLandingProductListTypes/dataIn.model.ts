/* eslint-disable @typescript-eslint/no-explicit-any */
export type TGenericLandingDataIn = {
  title: string;
  hideTitle?: boolean;
  productlistType: 'market' | 'eats';
  sliding?: 'normal' | 'slider';
  showSubHead?: boolean;
  showViewAll?: boolean;
  showDescription?: boolean;
  showPriceToggle?: boolean;
  priceStyle?: 'block' | 'flex';
  priceType: 'Non-Member' | 'Member';
  toggleOn?: boolean;
  index?: number;
  responsiveSliding?: boolean;
  addToCartButtonLabel: any;
  handleSuHeaderFunc?: (e: any) => void;
  handleClose?: (e: any) => void;
  handleProductPress: (e: any) => void;
  handleButtonPress: (e: any) => void;
  handleViewAll: (e: any) => void;
  handleBulkAdd?: (e: any) => any;
};
