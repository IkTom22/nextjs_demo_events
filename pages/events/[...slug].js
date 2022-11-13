import { useRouter } from 'next/router'
import {Fragment} from 'react'
import { getFilteredEvents } from '../../helpers/api-util'
import EventList from '../../components/events/event-list'
import ResultsTitle from '../../components/events/results-title'
import Button from '../../components/ui/button'
import ErrorAlert from '../../components/ui/error-alert'

function FilteredEventsPage(props) {
    // const router = useRouter()
    // console.log(router.query) //ie. {slug: ['2001', '5']}
    // const filterData = router.query.slug 

    // if (!filterData) {
    //     return <p className='center'>Loading</p>
    // }

    // const filteredYear = filterData[0]
    // const filteredMonth = filterData[1]
    // const numYear = +filteredYear
    // const numMonth = +filteredMonth

    if (props.hasError) {
        return (
            <Fragment>
                <ErrorAlert>
                    <p>Invalid filter. Pelase adjust your url values!</p>
                </ErrorAlert>
                <div class='center'>
                     <Button link='/events'> Show all Events</Button>
                </div>
            </Fragment>
            )
    }

    const filteredEvents =  props.events
    
    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <Fragment>
                <ErrorAlert>
                    <p>No events found for the chosen filter</p>
                </ErrorAlert>
                <div class='center'>
                     <Button link='/events'> Show all Events</Button>
                </div>
            </Fragment>
            )
    }

    const date = new Date(props.date.year, props.date.month - 1)
    console.log(date)

    return (
        <Fragment>
            <ResultsTitle date={date} />
            <EventList items={ filteredEvents} />
        </Fragment>
    )
}

export async function getServerSideProps(context) {
    const {params} = context
    const filterData = params.slug 

    if (!filterData) {
        return <p className='center'>Loading</p>
    }

    const filteredYear = filterData[0]
    const filteredMonth = filterData[1]
    const numYear = +filteredYear
    const numMonth = +filteredMonth

    if (isNaN(numYear) || isNaN(numMonth || numYear >2030 || numYear <2021 || numMonth <1 || numMonth >12)) {
        return {
            props:{hasError: true},
            // notFound: true,
            // redirect: {
            //     destination: '/error'
            // }
        }    
    }

    const filteredEvents = await getFilteredEvents({
        year: numYear,
        month: numMonth
    })
    
    return {
        props: {
            events: filteredEvents,
            date: {
                year: numYear,
                month: numMonth
            }
        }
    }
}

export default FilteredEventsPage