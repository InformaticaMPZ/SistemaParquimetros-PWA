import BottomNavBar from "components/General/BottomNavBar/BottomNavBar"
import Navbar from "../Navbar/Navbar"

interface Props {
	title?: string
	children: React.ReactNode
}

export const Page = ({ title, children }: Props) => (
	<>
		<Navbar />

		<main className='mt-24 pb-16 px-safe sm:pb-0' >
			<div className='ps-2 pe-2'>{children}</div>
		</main>
		<BottomNavBar />
	</>
)


