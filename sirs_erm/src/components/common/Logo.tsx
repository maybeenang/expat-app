import IcLogoText from '../../assets/icons/ic_logo_text.svg';

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({width, height}) => {
  return <IcLogoText width={width} height={height} />;
};

export default Logo;
