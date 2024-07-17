import { TGenericLandingDataIn } from './dataIn.model';
import { IGenericLandingDataLoad } from './dataLoad.model';

export default interface IGenericProductDetailsProps {
  dataIn: TGenericLandingDataIn;
  dataLoad: IGenericLandingDataLoad;
}
