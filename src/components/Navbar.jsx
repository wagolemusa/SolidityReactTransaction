import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import vv from '../components/images/vv.png'
import { useState } from 'react';

const NabarItem = ({ title, classprops }) => {
     return (
        <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
     )
}

const Navbar = () => {

    const [toggleMenu, setToggleMenu] = useState(false)
    return (
        <nav className="w-full flex md:justify-center justify-between items-center">
        <div className="md:flex-[0.5] flex-initial justify-center items-center">
                <img src={vv} alt="logo" className="w-20 cursor-pointer top-0"/>
            </div>
            <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
                {["Market", "Exchange", "Tutorials", "Wallets"].map(( item, index) => (
                    <NabarItem  key={item + index} title={item}/>

                ))}
                <li className='bg-[#2952e3] py-2 px-7 max-4 rounded-full curser-pointer hover:bg-[#254bd]'>Login</li>
            </ul>
            <div className='flex relative'>
                {toggleMenu
                ? <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(false)}/>
                : <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer' onClick={() => setToggleMenu(true)}/>
            }
            {toggleMenu && (
                <ul
                    className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-sreen shadow-2x1 md:hidden list-none
                    flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white  animate-slide-in
                    "
                >
                    <li className='text-xl w-full my-2'>
                        <AiOutlineClose onClick={() => setToggleMenu(false)} />
                    </li>
                    {["Market", "Exchange", "Tutorials", "Wallets"].map(( item, index) => (
                    <NabarItem  key={item + index} title={item} classprops="{my-2 text-lg}"/>

                ))}
                </ul>
            )}
            </div>
        </nav>
    )
}

export default Navbar;