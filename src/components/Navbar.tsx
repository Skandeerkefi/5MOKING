import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dices, Crown, Gift, Users, LogIn } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
	const location = useLocation();
	const isMobile = useIsMobile();
	const [isOpen, setIsOpen] = useState(false);

	const menuItems = [
		{ path: "/", name: "Home", icon: <Dices className='w-4 h-4 mr-1' /> },
		{
			path: "/leaderboard",
			name: "Leaderboard",
			icon: <Crown className='w-4 h-4 mr-1' />,
		},
		// { path: "/slot-calls", name: "Slot Calls", icon: <Users className="w-4 h-4 mr-1" /> },
		// { path: "/giveaways", name: "Giveaways", icon: <Gift className="w-4 h-4 mr-1" /> },
	];

	return (
		<nav className='sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-card/70'>
			<div className='container flex items-center justify-between py-3 mx-auto'>
				<div className='flex items-center gap-2'>
					<Link to='/' className='flex items-center'>
						<span className='text-xl font-bold gradient-text'>5MOKING</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				{!isMobile && (
					<div className='flex items-center gap-4'>
						<div className='flex items-center'>
							{menuItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`nav-link flex items-center ${
										location.pathname === item.path ? "nav-link-active" : ""
									}`}
								>
									{item.icon}
									{item.name}
								</Link>
							))}
						</div>

						<div className='flex items-center gap-2'>
							{/* <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button> */}
						</div>
					</div>
				)}

				{/* Mobile Navigation Button */}
				{isMobile && (
					<button
						className='p-2 rounded-md hover:bg-primary/10'
						onClick={() => setIsOpen(!isOpen)}
					>
						<div className='space-y-1.5'>
							<span
								className={`block h-0.5 w-6 bg-white transition-transform ${
									isOpen ? "rotate-45 translate-y-2" : ""
								}`}
							></span>
							<span
								className={`block h-0.5 w-6 bg-white transition-opacity ${
									isOpen ? "opacity-0" : ""
								}`}
							></span>
							<span
								className={`block h-0.5 w-6 bg-white transition-transform ${
									isOpen ? "-rotate-45 -translate-y-2" : ""
								}`}
							></span>
						</div>
					</button>
				)}
			</div>

			{/* Mobile Navigation Menu */}
			{isMobile && isOpen && (
				<div className='container flex flex-col gap-2 py-2 pb-4 mx-auto border-t border-white/10'>
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`nav-link flex items-center ${
								location.pathname === item.path ? "nav-link-active" : ""
							}`}
							onClick={() => setIsOpen(false)}
						>
							{item.icon}
							{item.name}
						</Link>
					))}
					<div className='flex items-center gap-2 mt-2'>
						<Button variant='outline' size='sm' className='flex-1' asChild>
							<Link to='/login'>
								<LogIn className='w-4 h-4 mr-1' />
								Login
							</Link>
						</Button>
						<Button size='sm' className='flex-1' asChild>
							<Link to='/signup'>Sign Up</Link>
						</Button>
					</div>
				</div>
			)}
		</nav>
	);
}
