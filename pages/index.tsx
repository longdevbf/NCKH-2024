import { useState, useEffect } from "react";
import type { NextPage } from "next";
import styles from '../styles/Home.module.css';
import { useWallet } from "@meshsdk/react";
import { Player } from '@lottiefiles/react-lottie-player';

const Home: NextPage = () => {
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const { wallet, connected } = useWallet();
  useEffect(() => {
    const isLoaded = sessionStorage.getItem('hasLoadedOnce');

    if (!isLoaded) {
      const timer = setTimeout(() => {
        setLoading(false);
        setFadeIn(true);
        sessionStorage.setItem('hasLoadedOnce', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      setFadeIn(true);
    }
  }, []);
  useEffect(() => {
    if (connected) {
      getAssets();
    }
  }, [connected]);
  const getAssets = async () => {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  };
  const Header = () => {
    useEffect(() => {
        if (!fadeIn) return;

        const strings: string[] = [
            'Welcome to HeritageChain The Future of Technology Is Here',
            'Preserving Personal Legacies Through Blockchain Technology',
            'A Secure and Transparent Legacy Management Platform',
            'Connecting Legacies to a Sustainable Future and Beyond',
        ];
        let counter: number = 0;        
        const options = {
            offset: 0,
            timeout: 15,
            iterations: 5,
            characters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'],
            resolveString: strings[counter],
            element: document.querySelector('.header__textAndImage-text--one')
        };
        const getRandomInteger = (min: number, max: number): number => 
            Math.floor(Math.random() * (max - min + 1)) + min;
        const randomCharacter = (characters: string[]): string => 
            characters[getRandomInteger(0, characters.length - 1)];
        const doRandomiserEffect = (options: any, callback: Function) => {
            const { characters, timeout, element, partialString } = options;
            let { iterations } = options;

            setTimeout(() => {
                if (iterations >= 0) {
                    const nextOptions = { ...options, iterations: iterations - 1 };

                    if (iterations === 0) {
                        element.innerHTML = partialString;
                    } else {
                        element.innerHTML = partialString.substring(0, partialString.length - 1) + randomCharacter(characters);
                    }
                    doRandomiserEffect(nextOptions, callback);
                } else if (typeof callback === "function") {
                    callback();
                }
            }, timeout);
        };

        const doResolverEffect = (options: any, callback: Function) => {
            const { resolveString, characters, offset } = options;
            const partialString = resolveString.substring(0, offset);
            const combinedOptions = { ...options, partialString };

            doRandomiserEffect(combinedOptions, () => {
                const nextOptions = { ...options, offset: offset + 1 };

                if (offset <= resolveString.length) {
                    doResolverEffect(nextOptions, callback);
                } else if (typeof callback === "function") {
                    callback();
                }
            });
        };

        const callback = () => {
            setTimeout(() => {
                counter++;
                if (counter >= strings.length) {
                    counter = 0;
                }
                const nextOptions = { ...options, resolveString: strings[counter] };
                doResolverEffect(nextOptions, callback);
            }, 1000);
        };

        if (typeof window !== 'undefined') {
            const headerElement = document.querySelector('.header__textAndImage-text--one');
            options.element = headerElement;
            doResolverEffect(options, callback);
        }
    }, [fadeIn]);

    return (
      <header className="header">
        <div className="header__textAndImage">
          <div className="header__textAndImage-text">
            <h1 className="header__textAndImage-text--one">
              Welcome to Web 3.0 The Future of Technology Is Here
            </h1>
            <p className="header__textAndImage-text-two">
              Welcome to Web3, where cutting-edge technology meets innovative creativity. Here, we believe in the power of blockchain and decentralized solutions to create a more transparent, secure, and sustainable digital world. Join us to explore the best that modern technology has to offer!
            </p>
          </div>
          <div className={`header__textAndImage-image ${fadeIn ? "fade-in" : ""}`}>
            <Player
              src="https://lottie.host/18525483-031f-4f2e-9e35-7fd813350b23/OLuEyQDrGd.json"
              background="transparent"
              speed={1}
              style={{ width: '500px', height: '500px', marginTop: '-50px' }}
              loop
              autoplay
            />
          </div>
        </div> 
      </header>
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <p className="loader__title">HC</p>
        </div>
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <div className={styles.fullOfHome}>
      <Header />
      <div className="between">
        <div className="transaction-container">
          <div className="transaction-item transaction-item--left">
            <span className="transaction-item__label">Request</span>
            <span className="transaction-item__size ">1000</span>
          </div>
          <div className="transaction-item transaction-item--center">
            <span className="transaction-item__label">Transaction</span>
            <span className="transaction-item__size ">322</span>
            <span className="transaction-item__check"></span>
          </div>
          <div className="transaction-item transaction-item--right">
            <span className="transaction-item__label">User</span>
            <span className="transaction-item__size transaction--online">1000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
