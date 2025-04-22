import React from 'react';
import COLORS from '../../../constants/colors';
import {Icon, IconName} from '../../common/CustomPhosporIcon';

const RentalCategoryIocn = ({
  categoryName,
  isActive = false,
}: {
  categoryName: string;
  isActive: boolean;
}) => {
  const color = isActive ? COLORS.textPrimary : COLORS.textSecondary;
  let iconName: IconName;
  switch (categoryName) {
    case 'all':
      iconName = 'ThumbsUp';
      break;
    case 'SHARED-ROOM':
      iconName = 'SquareSplitVertical';
      break;
    case 'ROOM':
      iconName = 'Bed';
      break;
    case 'UNIT':
      iconName = 'Bicycle';
      break;
    case 'APARTMENT':
      iconName = 'BuildingApartment';
      break;
    case 'HOUSE':
      iconName = 'House';
      break;
    case 'OFFICE-SPACE':
      iconName = 'OfficeChair';
      break;
    case 'WAREHOUSE':
      iconName = 'Warehouse';
      break;
    default:
      iconName = 'Square';
      break;
  }

  return <Icon name={iconName} size={24} color={color} />;
};

export default RentalCategoryIocn;
