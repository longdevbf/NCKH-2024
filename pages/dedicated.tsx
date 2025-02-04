import { useState, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useTransaction } from "../context/TransactionContext";

const LockProperty = () => {
  const { incrementTransactions } = useTransaction();
  const [amount, setAmount] = useState('');
  const [addresses, setAddresses] = useState<string[]>(['']);
  const [letters, setLetters] = useState<string[]>(['']);
  const [nfts, setNfts] = useState<(File | null)[]>([null]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [distributeOption, setDistributeOption] = useState<string | null>(null);
  const [values, setValues] = useState<string[]>(['']);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const previewAmount = amount === '' ? '' : amount;
  const previewCondition = selectedDate ? selectedDate.toLocaleString() : '';
  const previewNft = nfts[0] ? nfts[0]?.name : 'No NFT selected';
  const handleLock = () => {
    if (addresses.some(addr => addr.trim() === '')) {
      alert("Please enter all addresses before locking.");
      return;
    }
  
    if (distributeOption === 'set' && values.some(val => val.trim() === '')) {
      alert("Please enter values for all addresses.");
      return;
    }
  
    if (nfts.some(nft => nft === null)) {
      alert("Please select an NFT for each address.");
      return;
    }
  
    incrementTransactions();
  };
  const handleAddAddress = () => {
    if (addresses.length < 10) {
      setAddresses([...addresses, '']);
      setLetters([...letters, '']);
      setNfts([...nfts, null]);
      setValues([...values, '']);
      if (distributeOption === 'equal') {
        const newAmount = parseFloat(amount);
        const valuePerAddress = addresses.length > 0 ? newAmount / addresses.length : 0;
        setValues(Array(addresses.length).fill(valuePerAddress.toFixed(2)));
      }
    }
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    const newLetters = letters.filter((_, i) => i !== index);
    const newNfts = nfts.filter((_, i) => i !== index);
    const newValues = values.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    setLetters(newLetters);
    setNfts(newNfts);
    setValues(newValues);
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const handleLetterChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLetters = [...letters];
    newLetters[index] = e.target.value;
    setLetters(newLetters);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleNftChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newNfts = [...nfts];
    newNfts[index] = file;
    setNfts(newNfts);
  };

  const handleDistributeOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDistributeOption(value);
    if (value === 'equal') {
      const newAmount = parseFloat(amount);
      const valuePerAddress = addresses.length > 0 ? newAmount / addresses.length : 0;
      setValues(Array(addresses.length).fill(valuePerAddress.toFixed(2)));
    } else {
      setValues(Array(addresses.length).fill(''));
    }
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  return (
    <div className="lock-property">
      <div className="lock-property__form">
        <label className="lock-property__label">Distribute value</label>
        <select
          className="lock-property__select"
          onChange={handleDistributeOptionChange}
          value={distributeOption || ''}
        >
          <option value="">Select distribution option</option>
          <option value="equal">Distribute equally</option>
          <option value="set">Set individual values</option>
        </select>

        {addresses.map((address, index) => (
          <div key={index} className="lock-property__address-container">
            <div className="lock-property__address-input-container">
              <textarea
                className="lock-property__textarea"
                placeholder={`Enter address ${index + 1}`}
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                rows={1}
                style={{ resize: 'none' }}
              />

              {distributeOption === 'set' && (
                <input
                  type="number"
                  className="lock-property__input"
                  placeholder={`Value for address ${index + 1}`}
                  value={values[index]}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                />
              )}

              {index === 0 && addresses.length < 10 && (
                <button className="lock-property__add-button" onClick={handleAddAddress}>+</button>
              )}
              {addresses.length > 1 && index !== 0 && (
                <button className="lock-property__remove-button" onClick={() => handleRemoveAddress(index)}>-</button>
              )}
            </div>

            <label className="lock-property__label">Enter letter</label>
            <textarea
              className="lock-property__textarea"
              placeholder="Enter letter"
              value={letters[index]}
              onChange={(e) => handleLetterChange(index, e)}
              rows={1}
            />

            <label className="lock-property__label">Choose NFT</label>
            <input
              type="file"
              className="lock-property__input"
              accept="image/*"
              onChange={(e) => handleNftChange(index, e)}
            />
          </div>
        ))}

        <div className="button-container">
          <button className="button-lock" onClick={handleLock}>Lock</button>
        </div>
      </div>

      <div className="lock-property__preview">
        <h3 className="lock-property__preview-title">Preview</h3>
        <div className="lock-property__preview-box">
          {addresses.map((address, index) => (
            <p key={index}>
              Address {index + 1}: {address === '' ? 'NaN' : address}
              {distributeOption === 'set' && values[index] && (
                <span> - Value: {values[index]}</span>
              )}
              <br />
              Letter: {letters[index]}
              <br />
              NFT: {nfts[index] ? nfts[index]?.name : 'No NFT selected'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LockProperty;
