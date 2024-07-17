/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBanner } from '@/src/common/types/banner';
import { useStyles } from './useStyles';
import { SxProps, Theme } from '@mui/material';
import { INextImages } from '@/src/common/types/nextImage';

export default function useViewModel({
  backgroundColor,
  slogan,
  name,
  featured_image,
  buttonClick,
  buttonLabel,
}: IBanner) {
  const v1Styles = {
    display: 'block',
    alignItems: 'center',
  } as SxProps<Theme>;

  const designsProps = v1Styles;
  const classes = useStyles({
    backgroundColor: backgroundColor,
    designs: designsProps,
  });

  const imageLoader = ({ src, width, quality }: INextImages) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const imagesData = {
    imageLoader: imageLoader as any,
    alt: 'product-logo',
    src: featured_image,
    height: 252,
    width: 272,
  };

  return {
    model: {
      classes,
      buttonLabel,
      backgroundColor,
      name,
      slogan,
      featured_image,
      buttonClick,
      imagesData,
      designsProps,
    },
  };
}
