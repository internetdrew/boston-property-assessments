import { Property } from '../App';
import { formatHypenatedString } from '../utils';
import { isCondo } from '../constants';

interface PropertyReceiptProps {
  property: Property;
}

const PropertyReceipt = ({ property }: PropertyReceiptProps) => {
  return (
    <div id='chosen-result' className='chosen-result'>
      <h3>Property Assessment Details</h3>
      <h4>
        {property.MAIL_STREET_ADDRESS},{property.ZIP_CODE}
        <br />
        {property.MAIL_CITY}, {property.MAIL_STATE}
      </h4>

      <section className='receipt-section'>
        <h4>Property Information</h4>
        <p>
          Building Type: {formatHypenatedString(property.BLDG_TYPE) || 'N/A'}
        </p>
        <p>Description: {property.LU_DESC || 'N/A'}</p>
        <p>Year Built: {property.YR_BUILT || 'N/A'}</p>
        <p>Last Remodel: {property.YR_REMODEL || 'N/A'}</p>
        <p>
          Floors:{' '}
          {isCondo(property.LU)
            ? property.CD_FLOOR || 'N/A'
            : property.RES_FLOOR || 'N/A'}
        </p>
        <p>Gross Area: {property.GROSS_AREA || 'N/A'} sq ft</p>
        <p>Living Area: {property.LIVING_AREA || 'N/A'} sq ft</p>
        <p>Land Size: {property.LAND_SF || 'N/A'} sq ft</p>
        <p>Bedrooms: {property.BED_RMS || 'N/A'}</p>
        <p>Full Bathrooms: {property.FULL_BTH || 'N/A'}</p>
        <p>Half Bathrooms: {property.HLF_BTH || 'N/A'}</p>
      </section>

      <section className='receipt-section'>
        <h4>Assessment Values</h4>
        <p>Building Value: ${property.BLDG_VALUE || 'N/A'}</p>
        <p>Land Value: ${property.LAND_VALUE || 'N/A'}</p>
        <p>Total Value: ${property.TOTAL_VALUE || 'N/A'}</p>
        <p>Annual Tax: {property.GROSS_TAX || 'N/A'}</p>
      </section>

      <section className='receipt-section'>
        <h4>Features</h4>
        <p>Parking Spaces: {property.NUM_PARKING || 'N/A'}</p>
        <p>Fireplaces: {property.FIREPLACES || 'N/A'}</p>
        <p>Kitchen: {formatHypenatedString(property.KITCHEN_TYPE) || 'N/A'}</p>
      </section>
    </div>
  );
};

export default PropertyReceipt;
