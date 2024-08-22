import React from "react";
import Input from "../FormElements/Input";

interface ConditionFieldProps {
  condition: any;
  index: number;
  handleConditionChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  currencies: { value: string; label: string; name: string }[];
}

const ConditionSection: React.FC<ConditionFieldProps> = ({
  condition,
  index,
  handleConditionChange,
  currencies,
}) => {
  return (
  
      <div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            element="input"
            id="tarif"
            label="Tarif :"
            value={condition.tarif}
            onChange={handleConditionChange(index)}
            validators={[]}
            placeholder="Tapez un tarif"
            create
            gray
          />
          <Input
            element="select"
            id="currency"
            label="Devise :"
            value={condition.currency}
            onChange={handleConditionChange(index)}
            validators={[]}
            options={currencies}
            placeholder="Choississez une devise"
            create
            gray
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
          <fieldset className="flex justify-center">
            <legend className="text-sm font-medium text-gray-800 text-center">
              RFA :
            </legend>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rfa"
                  name={`rfa-${index}`}
                  value="oui"
                  checked={condition.rfa === "oui"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`rfa-oui-${index}`}>Oui</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="rfa"
                  name={`rfa-${index}`}
                  value="non"
                  checked={condition.rfa === "non"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`rfa-non-${index}`}>Non</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="flex justify-center">
            <legend className="text-sm font-medium text-gray-800 text-center">
              Prix nets :
            </legend>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="net_price"
                  name={`price-net-${index}`}
                  value="oui"
                  checked={condition.net_price === "oui"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`price-oui-${index}`}>Oui</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="net_price"
                  name={`price-net-${index}`}
                  value="non"
                  checked={condition.net_price === "non"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`price-non-${index}`}>Non</label>
              </div>
            </div>
          </fieldset>

          <fieldset className="flex justify-center">
            <legend className="text-sm font-medium text-gray-800 text-center">
              Etiquetage :
            </legend>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="labeling"
                  name={`tag-${index}`}
                  value="oui"
                  checked={condition.labeling === "oui"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`tag-oui-${index}`}>Oui</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="labeling"
                  name={`tag-${index}`}
                  value="non"
                  checked={condition.labeling === "non"}
                  onChange={handleConditionChange(index)}
                />
                <label htmlFor={`tag-non-${index}`}>Non</label>
              </div>
            </div>
          </fieldset>
        </div>
        
        <div className="text-center mt-[30px]">
          <span className="text-sm font-medium text-gray-800">
            Condition de paiement :
          </span>
          <div className="flex items-center justify-center gap-[30px] font-[600] text-gray-700 mt-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="paiement_condition"
                name={`paymentCondition-${index}`}
                value="45 jours fin du mois"
                checked={condition.paiement_condition === "45 jours fin du mois"}
                onChange={handleConditionChange(index)}
              />
              <label htmlFor={`payment-45j-${index}`} className="text-[13px]">
                45 jours fin du mois
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="paiement_condition"
                name={`paymentCondition-${index}`}
                value="10 jours réception facture avec escompte supplémentaire"
                checked={condition.paiement_condition === "10 jours réception facture avec escompte supplémentaire"}
                onChange={handleConditionChange(index)}
              />
              <label htmlFor={`payment-10j-${index}`} className="text-[13px]">
                10 jours réception facture avec escompte supplémentaire
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="paiement_condition"
                name={`paymentCondition-${index}`}
                value="60 jours date facture"
                checked={condition.paiement_condition === "60 jours date facture"}
                onChange={handleConditionChange(index)}
              />
              <label htmlFor={`payment-60j-${index}`} className="text-[13px]">
                60 jours date facture
              </label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Input
            element="input"
            id="franco"
            label="Franco :"
            value={condition.franco}
            onChange={handleConditionChange(index)}
            validators={[]}
            placeholder="Ex: 500 EUR, 1000 USD..."
            create
            gray
          />
          <Input
            element="input"
            id="validate_tarif"
            label="Validité des tarifs :"
            value={condition.validate_tarif}
            onChange={handleConditionChange(index)}
            validators={[]}
            placeholder="Ex: 6 mois, 1 mois..."
            create
            gray
          />
          <Input
            element="input"
            id="budget"
            label="Budget marketing :"
            value={condition.budget}
            onChange={handleConditionChange(index)}
            validators={[]}
            placeholder="Ex: 5000 EUR par an"
            create
            gray
          />
        </div>
      </div>

  );
};

export default ConditionSection;
