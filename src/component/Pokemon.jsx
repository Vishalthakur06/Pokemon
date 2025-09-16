import React, { useState, useEffect } from "react";

export const Pokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        );
        const data = await res.json();

        const details = await Promise.all(
          data.results.map((poke) => fetch(poke.url).then((res) => res.json()))
        );

        setPokemonList(details);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-white text-xl">Loading Pokémon...</p>
      </div>
    );
  }

  const typeColors = {
    electric: "bg-yellow-400 text-black",
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    grass: "bg-green-500 text-white",
    poison: "bg-purple-600 text-white",
    normal: "bg-gray-400 text-black",
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-4">
        Let's Catch Pokémon
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full max-w-md px-4 py-3 rounded-full text-white font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      {/* Pokémon Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pokemonList
          .filter((pokemon) => pokemon.name.includes(searchTerm))
          .map((pokemon) => {
            const imageUrl =
              pokemon.sprites.other["official-artwork"].front_default;
            return (
              <div
                key={pokemon.id}
                className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transform transition-transform duration-300 ease-in-out text-center text-white"
              >
                {/* Pokémon Image */}
                <div className="w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>

                {/* Pokémon Info */}
                <div className="p-4 sm:p-6 space-y-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold capitalize">
                    {pokemon.name}
                  </h2>

                  {/* Responsive Stats Grid */}
                  {/* Main Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-white font-semibold text-sm mt-2">
                    <div className="flex justify-around p-2 bg-white/10 rounded-lg">
                      <span>Height :</span>
                      <span>{pokemon.height}</span>
                    </div>
                    <div className="flex justify-around p-2 bg-white/10 rounded-lg">
                      <span>Weight : </span>
                      <span>{pokemon.weight}</span>
                    </div>
                    <div className="flex justify-around p-2 bg-white/10 rounded-lg">
                      <span>Attack : </span>
                      <span>
                        {
                          pokemon.stats.find((s) => s.stat.name === "attack")
                            .base_stat
                        }
                      </span>
                    </div>
                  </div>

                  {/* Separate Ability & Experience */}
                  <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
                    <div className="flex justify-around p-2 bg-white/10 rounded-lg flex-1">
                      <span>Ability : </span>
                      <span>{pokemon.abilities[0].ability.name}</span>
                    </div>
                    <div className="flex justify-around p-2 bg-white/10 rounded-lg flex-1">
                      <span>Experience : </span>
                      <span>{pokemon.base_experience}</span>
                    </div>
                  </div>

                  {/* Types */}
                  <div className="flex flex-wrap justify-center gap-2 mb-2 mt-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          typeColors[type.type.name] || "bg-gray-500 text-white"
                        }`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>

                  {/* Catch Button */}
                  <button className="mt-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full shadow-md transition duration-200">
                    Catch!
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit(limit + 20)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-md transition duration-200"
        >
          Load More
        </button>
      </div>
    </div>
  );
};
