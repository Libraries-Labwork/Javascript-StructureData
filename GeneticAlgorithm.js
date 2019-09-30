/**
 * Definisikan Fungsi
 * var x1 = (Math.random() * 3) - 3
 * var x2 = (Math.random() * 2) - 2
 * console.log(evaluation([x1, x2]))
 */
function evaluation(x) {
  return (4 - (2.1 * Math.pow(x[0], 2)) + (Math.pow(x[0], 4) / 3)) * Math.pow(x[0], 2) + (x[0] * x[1]) + (-4 + (4 * Math.pow(x[1], 2))) * Math.pow(x[1], 2)
}

// Tentukan Batasan
limit = [[-3, 3], [-2, 2]]

/**
 * Tentukan Bentuk Pemilihan Chromosome (Cara termuda adalah real value)
 * for (var i = 0; i < 10; i++) {
 *  console.log(generate_chromosome())
 * }
 */
function generate_chromosome() {
  return [Math.random() * (limit[0][1] - limit[0][0]) + limit[0][0], Math.random() * (limit[1][1] - limit[1][0]) + limit[1][0]]
}

/**
 * Buat Populasi
 * console.log(generate_population(5))
 */
function generate_population(size) {
  population = []
  for (var i = 0; i < size; i++) {
    population.push(generate_chromosome())
  }
  return population
}

/**
 * Tentukan Fitness Function
 * console.log(fitness([-3, 3]))
 */
function fitness(x) {
  return 1 / (evaluation(x) + 8)
}

/**
 * Kalkulasikan Populasi Fitness
 * console.log(calculate_population_fitness(generate_population(5)))
 */
function calculate_population_fitness(population) {
  fitnesses = []
  population.map((item) => fitnesses.push(fitness(item)))
  return fitnesses
}

/**
 * Mencari Parent (Roulette Wheel Selection)
 * var population = generate_population(5)
 * console.log(roulette_wheel(
 *  population,
 *  calculate_population_fitness(population)
 * ))
 */
function roulette_wheel(population, fitnesses) {
  sum_fitness = fitnesses.reduce((total, current) => total + current, 0)
  select_id = -1
  random = (Math.random() * (sum_fitness)) + 0
  fitnesses.some((item, i) => {
    // console.log(random + " + " + item)
    if (random <= 0) {
      select_id = i; 
      return true
    }
    random -= item; 
    return false
  })
  select_id == -1 ? roulette_wheel(population, fitnesses) : select_id
  return population[select_id]
  // return select_id
}

/**
 * Sample Populasi
 * population = generate_population(5)
 * fitnesses = calculate_population_fitness(population)
 * console.log(sample_population(population, fitnesses))
 */
function sample_population(population, fitnesses, selection_rate) {
  num_of_selected_chromosome = parseInt(selection_rate * population.length)
  mating_population = []
  // console.log(num_of_selected_chromosome + " " + population.length)
  for (var i = 0; i < num_of_selected_chromosome; i++) 
    mating_population.push(roulette_wheel(population, fitnesses))

  return mating_population
}

/**
 * Rekombinasi (Crossover)
 * population = generate_population(5)
 * fitnesses = calculate_population_fitness(population)
 * mating_probability = 0.7
 * mating_population = sample_population(population, fitnesses)
 * console.log(mating_population)
 * console.log(crossover(mating_population))
 */
function crossover (mating_population) {
  // console.log(mating_population.length - 1)
  for (var i = 0; i < (mating_population.length - 1); i++) {
    parent1 = mating_population[i]
    parent2 = mating_population[i + 1]
    crossover_bit = Math.random() * ((parent1.length - 1) - 1) + 1
    temp = parent1[crossover_bit]
    parent1[crossover_bit] = parent2[crossover_bit]
    parent2[crossover_bit] = temp
    mating_population[i] = parent1
    mating_population[i + 1] = parent2
  }
  return mating_population
}

/**
 * Mutasi
 * population = generate_population(5)
 * mutation_probability = 0.0001
 * console.log(mutate(population, mutation_probability))
 */
function mutate(population, mutation_probability) {
  for (var i = 0; i < population.length; i++) {
    random = Math.random()
    if (random < mutation_probability) {
      cur_chromosome = population[i]
      random = Math.round(Math.random() * (cur_chromosome - 1)) + 0
      random_gen = cur_chromosome[Math.round(Math.random() * (cur_chromosome - 1)) + 0]
      cur_chromosome[random] = random_gen
      population[i] = cur_chromosome
    }
  }
  return population
}

/**
 * Populasi Penimpah
 * population = generate_population(5)
 * fitnesses = calculate_population_fitness(population)
 * preserve_rate = 0.3
 * console.log(preserve_top(population, fitnesses, preserve_rate))
 */
function preserve_top(population, fitnesses
, preserve_rate) {
  newPopulation = []
  for (var i = 0; i < population.length; i++) {
    newPopulation.push({
      chromosome: population[i],
      fitness: fitnesses[i]
    })
  }

  newPopulation.sort((a, b) => (a.fitness < b.fitness) ? 1 : (a.fitness == b.fitness) ? 0 : -1)
  population = []
  newPopulation.map((item) => {
    population.push(item.chromosome)
  })

  num_of_preserved_chromosome = Math.ceil(preserve_rate * population.length)
  return population.splice(0, num_of_preserved_chromosome)
  // return population
}

/**
 * Buat generasi
 * population = generate_population(5)
 * fitness_values = calculate_population_fitness(population)
 * mating_probability = 0.7
 * mutation_probability = 0.001
 * console.log(create_generation(population, fitness_values, mating_probability, mutation_probability))
 */
function create_generation(population, fitnesses, mating_probability, mutation_probability) {
  mating_population = sample_population(population, fitnesses, mating_probability)
  parents = crossover(mating_population)
  preserved_population = preserve_top(population, fitnesses, (1 - mating_probability).toFixed(1))
  // console.log(mating_population.length + " == " + preserved_population.length)
  new_population = parents
  preserved_population.map((item) => {
    new_population.push(item)
  })
  new_population = mutate(new_population, mutation_probability)
  return new_population
}

// GA
function genetic_algorithm(size, mating_probability, mutation_probability) {
  max_generation = size
  generation = 0
  list_best_on_generation = []
  population = generate_population(size)
  fitnesses = calculate_population_fitness(population)
  for (generation = 0; generation < max_generation; generation++) {
    population = create_generation(population, fitnesses, mating_probability, mutation_probability)
    fitnesses = calculate_population_fitness(population)
    min_idx = fitnesses.indexOf(Math.min(...fitnesses))
    best_chromosome_on_generation = population[min_idx]
    list_best_on_generation.push(best_chromosome_on_generation)
  }
  return list_best_on_generation[list_best_on_generation.length - 1]
}
size = 100
mating_probability = 0.7
mutation_probability = 0.001

// for (var i = 0; i < size; i++) {
//   best_chromosome = genetic_algorithm(size, mating_probability, mutation_probability)
//   console.log(evaluation(best_chromosome))
// }

// Algoritma GA
// Buat Populasi
// Buat Fitness Value dari Populasi
// Initialisasi Generasi dan Temp Best Chromosome
// Buat Generasi
// Cari Fitness Value Dari Generasi
// Cari Kromosom Terbaik disetiap generasi
