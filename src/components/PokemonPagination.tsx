import axios from "axios"
import {useEffect, useState} from "react"
import Pokemon from "../interface/Pokemon"
import {Button, Col, Row} from "react-bootstrap"
import PokemonType from "../interface/PokemonType"
const PokemonPagination = () => {
  const [pokeData, setPokeData] = useState<Pokemon[]>([])
  const [pokeType, setPokeType] = useState<PokemonType[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon")
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [prevPage, setPrevPage] = useState<string | null>(null)
  useEffect(() => {
   getPokemon()
  },[url])
  useEffect(() => {
   getPokemonTypes()
  },[])
  const getPokemon = async () => {
    setLoading(true)
    const res = await axios.get(url)
    setNextPage(res?.data?.next)
    setPrevPage(res?.data?.prev)
    getPokemonUpdated(res.data.results)
    setLoading(false)
  }

  const getPokemonUpdated = async (res:any) => {
    res?.map(async (item: any) => {
      const result = await axios.get(item?.url)
      setPokeData((state) => {
       state = [...state, result?.data]
       return state
      })
    })
  }
  const getPokemonTypes = async () => {
    let resType = await axios.get("https://pokeapi.co/api/v2/type/")
    setPokeType(resType?.data?.results)
  }
  const handlePrevClick = () => {
    setUrl(prevPage || "")
  }
  
  const handleNextClick = () => {
    setUrl(nextPage || "")
  }
  return (
   <div>
     <span className="d-flex">
       <h4 className="text-length mt-2">Types:</h4>
       <span className="mt-1 ml-2">
        {pokeType?.map((i, index) => {
          return(
           <Button variant="outline-danger" key={index} className="ml-1 mt-1">
             {i?.name}
           </Button>
          )
         })
         }
       </span>
     </span>
     <h5 className="p-2 font-weight-bold text-length">{pokeData?.length + " results found."}</h5>
     {
       loading ? <h1>Loading...</h1> 
       :      
       <Row>
        {pokeData?.map((i, index) => {
          return(
           <Col lg="3" key={index}>
             <img src={i?.sprites?.front_default} alt=""/>
             <p className="text-secondary text-center">{i?.name}</p>
           </Col>
        )
       })
      }
     </Row>
     }
     <div className="d-flex justify-content-center">
       <Button className="ml-2 btn-danger" onClick={handlePrevClick}>Prev</Button>
       <Button className="ml-2 btn-danger" onClick={handleNextClick}>Next</Button>
     </div>
   </div>
  )
}

export default PokemonPagination