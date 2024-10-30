import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
	{ label: 'Comprar Tiempo', href: '/compras' },
	{ label: 'Pago de Multas', href: '/pagos' },
	{ label: 'Garaje', href: '/garaje' },
]

const Navbar = () => {
	const router = useRouter()

	return (
		<div className='fixed top-0 left-0 z-20 w-full pt-safe '>
			<header className='text-white bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 font-medium shadow-lg rounded-b-md text-sm text-center'>
				<div className='mx-auto flex h-20 max-w-screen items-center justify-between px-6'>
					<Link href="/">
						<img src="/images/logo.png" alt="Logo" className="h-16 my-2 md:mr-4" />
					</Link>

					<nav className='flex items-center space-x-6'>
					<div className='hidden sm:block'>
							<div className='flex items-center space-x-6'>
								{links.map(({ label, href }) => (
									<Link
										key={label}
										href={href}
										className={`text-sm ${
											router.pathname === href
												? 'text-white text-[16px] font-bold'
												: 'text-zinc-100  font-medium hover:text-white '
										}`}
									>
										{label}
									</Link>
								))}
							</div>
						</div>

					</nav>
				</div>
			</header>
		</div>
	)
}

export default Navbar;
