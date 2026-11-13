// One stroke icon family (24px grid, 1.75 stroke) replacing emoji used as icons.
const base = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
};

const make = (paths) =>
  function Icon({ className = "w-5 h-5", ...rest }) {
    return (
      <svg {...base} className={className} {...rest}>
        {paths}
      </svg>
    );
  };

export const CartIcon = make(<><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 8H6.2" /><circle cx="10" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" /></>);
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h10" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6 6 18" />);
export const SearchIcon = make(<><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>);
export const TrashIcon = make(<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12.2A2 2 0 0 0 8.5 21h7a2 2 0 0 0 2-1.8l1-12.2M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7" />);
export const ArrowRight = make(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowLeft = make(<path d="M19 12H5M11 6l-6 6 6 6" />);
export const AlertIcon = make(<><path d="M12 3.5 2.8 19.5h18.4z" /><path d="M12 10v4.5M12 17.2v.01" /></>);
export const BoxIcon = make(<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>);
export const LeafIcon = make(<><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" /><path d="M5 19 13 11" /></>);
export const BoltIcon = make(<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z" />);
export const StarIcon = make(<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />);
export const PlateIcon = make(<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /></>);
export const SliceIcon = make(<><path d="M12 21 3.2 6.2a14 14 0 0 1 17.6 0z" /><path d="M4.7 8.6a11 11 0 0 1 14.6 0" /><circle cx="10" cy="11" r="1" /><circle cx="14" cy="14" r="1" /><circle cx="12.5" cy="9.5" r=".8" /></>);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const ClockIcon = make(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const RupeeIcon = make(<path d="M7 4.5h10M7 9h10M7 4.5h3.5a4.5 4.5 0 0 1 0 9H7l7.5 7" />);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const UsersIcon = make(<><circle cx="9" cy="8.5" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18.5 14a6.5 6.5 0 0 1 3 6" /></>);
export const RefreshIcon = make(<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4" />);
