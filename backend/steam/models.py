from django.db import models

class Team(models.TextChoices):
    RADIANT = 'Radiant'
    DIRE = 'Dire'
    
class Hero(models.IntegerChoices):
    ANTI_MAGE = 1, 'Anti-Mage'
    AXE = 2, 'Axe'
    BANE = 3, 'Bane'
    BLOODSEEKER = 4, 'Bloodseeker'
    CRYSTAL_MAIDEN = 5, 'Crystal Maiden'
    DROW_RANGER = 6, 'Drow Ranger'
    EARTHSHAKER = 7, 'Earthshaker'
    JUGGERNAUT = 8, 'Juggernaut'
    MIRANA = 9, 'Mirana'
    MORPHLING = 10, 'Morphling'
    SHADOW_FIEND = 11, 'Shadow Fiend'
    PHANTOM_LANCER = 12, 'Phantom Lancer'
    PUCK = 13, 'Puck'
    PUDGE = 14, 'Pudge'
    RAZOR = 15, 'Razor'
    SAND_KING = 16, 'Sand King'
    STORM_SPIRIT = 17, 'Storm Spirit'
    SVEN = 18, 'Sven'
    TINY = 19, 'Tiny'
    VENGEFUL_SPIRIT = 20, 'Vengeful Spirit'
    WINDRANGER = 21, 'Windranger'
    ZEUS = 22, 'Zeus'
    KUNKKA = 23, 'Kunkka'
    LINA = 25, 'Lina'
    LION = 26, 'Lion'
    SHADOW_SHAMAN = 27, 'Shadow Shaman'
    SLARDAR = 28, 'Slardar'
    TIDEHUNTER = 29, 'Tidehunter'
    WITCH_DOCTOR = 30, 'Witch Doctor'
    LICH = 31, 'Lich'
    RIKI = 32, 'Riki'
    ENIGMA = 33, 'Enigma'
    TINKER = 34, 'Tinker'
    SNIPER = 35, 'Sniper'
    NECROPHOS = 36, 'Necrophos'
    WARLOCK = 37, 'Warlock'
    BEASTMASTER = 38, 'Beastmaster'
    QUEEN_OF_PAIN = 39, 'Queen of Pain'
    VENOMANCER = 40, 'Venomancer'
    FACELESS_VOID = 41, 'Faceless Void'
    WRAITH_KING = 42, 'Wraith King'
    DEATH_PROPHET = 43, 'Death Prophet'
    PHANTOM_ASSASSIN = 44, 'Phantom Assassin'
    PUGNA = 45, 'Pugna'
    TEMPLAR_ASSASSIN = 46, 'Templar Assassin'
    VIPER = 47, 'Viper'
    LUNA = 48, 'Luna'
    DRAGON_KNIGHT = 49, 'Dragon Knight'
    DAZZLE = 50, 'Dazzle'
    CLOCKWERK = 51, 'Clockwerk'
    LESHRAC = 52, 'Leshrac'
    NATURES_PROPHET = 53, "Nature's Prophet"
    LIFESTEALER = 54, 'Lifestealer'
    DARK_SEER = 55, 'Dark Seer'
    CLINKZ = 56, 'Clinkz'
    OMNIKNIGHT = 57, 'Omniknight'
    ENCHANTRESS = 58, 'Enchantress'
    HUSKAR = 59, 'Huskar'
    NIGHT_STALKER = 60, 'Night Stalker'
    BROODMOTHER = 61, 'Broodmother'
    BOUNTY_HUNTER = 62, 'Bounty Hunter'
    WEAVER = 63, 'Weaver'
    JAKIRO = 64, 'Jakiro'
    BATRIDER = 65, 'Batrider'
    CHEN = 66, 'Chen'
    SPECTRE = 67, 'Spectre'
    ANCIENT_APPARITION = 68, 'Ancient Apparition'
    DOOM = 69, 'Doom'
    URSA = 70, 'Ursa'
    SPIRIT_BREAKER = 71, 'Spirit Breaker'
    GYROCOPTER = 72, 'Gyrocopter'
    ALCHEMIST = 73, 'Alchemist'
    INVOKER = 74, 'Invoker'
    SILENCER = 75, 'Silencer'
    OUTWORLD_DESTROYER = 76, 'Outworld Destroyer'
    LYCAN = 77, 'Lycan'
    BREWMASTER = 78, 'Brewmaster'
    SHADOW_DEMON = 79, 'Shadow Demon'
    LONE_DRUID = 80, 'Lone Druid'
    CHAOS_KNIGHT = 81, 'Chaos Knight'
    MEEPO = 82, 'Meepo'
    TREANT_PROTECTOR = 83, 'Treant Protector'
    OGRE_MAGI = 84, 'Ogre Magi'
    UNDYING = 85, 'Undying'
    RUBICK = 86, 'Rubick'
    DISRUPTOR = 87, 'Disruptor'
    NYX_ASSASSIN = 88, 'Nyx Assassin'
    NAGA_SIREN = 89, 'Naga Siren'
    KEEPER_OF_THE_LIGHT = 90, 'Keeper of the Light'
    IO = 91, 'Io'
    VISAGE = 92, 'Visage'
    SLARK = 93, 'Slark'
    MEDUSA = 94, 'Medusa'
    TROLL_WARLORD = 95, 'Troll Warlord'
    CENTAUR_WARRUNNER = 96, 'Centaur Warrunner'
    MAGNUS = 97, 'Magnus'
    TIMBERSAW = 98, 'Timbersaw'
    BRISTLEBACK = 99, 'Bristleback'
    TUSK = 100, 'Tusk'
    SKYWRATH_MAGE = 101, 'Skywrath Mage'
    ABADDON = 102, 'Abaddon'
    ELDER_TITAN = 103, 'Elder Titan'
    LEGION_COMMANDER = 104, 'Legion Commander'
    TECHIES = 105, 'Techies'
    EMBER_SPIRIT = 106, 'Ember Spirit'
    EARTH_SPIRIT = 107, 'Earth Spirit'
    UNDERLORD = 108, 'Underlord'
    TERRORBLADE = 109, 'Terrorblade'
    PHOENIX = 110, 'Phoenix'
    ORACLE = 111, 'Oracle'
    WINTER_WYVERN = 112, 'Winter Wyvern'
    ARC_WARDEN = 113, 'Arc Warden'
    MONKEY_KING = 114, 'Monkey King'
    DARK_WILLOW = 119, 'Dark Willow'
    PANGOLIER = 120, 'Pangolier'
    GRIMSTROKE = 121, 'Grimstroke'
    HOODWINK = 123, 'Hoodwink'
    VOID_SPIRIT = 126, 'Void Spirit'
    SNAPFIRE = 128, 'Snapfire'
    MARS = 129, 'Mars'
    RINGMASTER = 131, 'Ringmaster'
    DAWNBREAKER = 135, 'Dawnbreaker'
    MARCI = 136, 'Marci'
    PRIMAL_BEAST = 137, 'Primal Beast'
    MUERTA = 138, 'Muerta'
    KEZ = 145, 'Kez'

class Player(models.Model):
    account_id = models.BigIntegerField(primary_key=True)
    steam_id = models.CharField(max_length=25)
    steam_name = models.CharField(max_length=100, null=True, blank=True)
    avatar_url = models.CharField(max_length=150, null=True, blank=True)
    profile_url = models.CharField(max_length=150)
    plus = models.BooleanField()
    rank_tier = models.IntegerField(null=True, blank=True)
    leaderboard_rank = models.IntegerField(null=True, blank=True)
    computed_mmr = models.IntegerField(null=True, blank=True)

class LeagueTeam(models.Model):
    team_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    tag = models.CharField(max_length=10, null=True, blank=True)
    logo_url = models.CharField(max_length=150, null=True, blank=True)


class Match(models.Model):
    match_id = models.BigIntegerField(primary_key=True)
    winner = models.CharField(max_length=10, choices=Team.choices)
    duration = models.IntegerField()
    start_time = models.IntegerField()
    game_mode = models.IntegerField()
    radiant_score = models.IntegerField()
    dire_score = models.IntegerField()
    barracks_status_radiant = models.IntegerField()
    barracks_status_dire = models.IntegerField()
    tower_status_radiant = models.IntegerField()
    tower_status_dire = models.IntegerField()
    first_blood_time = models.IntegerField()
    radiant_team = models.ForeignKey(LeagueTeam, on_delete=models.SET_NULL, null=True, blank=True, related_name='radiant_matches')
    dire_team = models.ForeignKey(LeagueTeam, on_delete=models.SET_NULL, null=True, blank=True, related_name='dire_matches')
    patch = models.IntegerField()
    loser_max_gold_adv = models.IntegerField()
    loser_max_gold_disadv = models.IntegerField()
    winner_max_gold_adv = models.IntegerField()
    winner_max_gold_disadv = models.IntegerField()
    replay_url = models.TextField(max_length=150)

    def __str__(self):
        return str(self.match_id)

class MatchPlayer(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='players')
    account = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='players')
    hero = models.IntegerField(choices=Hero.choices)
    player_slot = models.IntegerField(null=True, blank=True)
    team = models.CharField(max_length=10, choices=Team.choices)
    assists = models.IntegerField()
    camps_stacked = models.IntegerField()
    creeps_stacked = models.IntegerField()
    deaths = models.IntegerField()
    denies = models.IntegerField()
    gold = models.IntegerField()
    gold_per_min = models.IntegerField()
    gold_spent = models.IntegerField()
    hero_damage = models.IntegerField()
    hero_healing = models.IntegerField()
    kills = models.IntegerField()
    last_hits = models.IntegerField()
    leaver_status = models.IntegerField()
    level = models.IntegerField()
    obs_placed = models.IntegerField()
    party_id = models.IntegerField()
    hero_variant = models.IntegerField()
    pings = models.IntegerField()
    rune_pickups = models.IntegerField()
    sen_placed = models.IntegerField()
    stuns = models.FloatField()
    tower_damage = models.IntegerField()
    xp_per_min = models.IntegerField()
    win = models.IntegerField()
    lose = models.IntegerField()
    total_gold = models.IntegerField()
    total_xp = models.IntegerField()
    kills_per_min = models.FloatField()
    kda = models.FloatField()
    abandons = models.IntegerField()
    neutral_kills = models.IntegerField()
    tower_kills = models.IntegerField()
    courier_kills = models.IntegerField()
    lane_kills = models.IntegerField()
    hero_kills = models.IntegerField()
    observer_kills = models.IntegerField()
    sentry_kills = models.IntegerField()
    roshan_kills = models.IntegerField()
    necronomicon_kills = models.IntegerField()
    ancient_kills = models.IntegerField()
    buyback_count = models.IntegerField()
    observer_uses = models.IntegerField()
    sentry_uses = models.IntegerField()
    lane_efficiency = models.FloatField(null=True, blank=True)
    lane_efficiency_pct = models.FloatField(null=True, blank=True)
    lane = models.IntegerField(null=True, blank=True)
    lane_role = models.IntegerField(null=True, blank=True)
    is_roaming = models.BooleanField(null=True, blank=True)
    purchase_tpscroll = models.IntegerField()
    actions_per_min = models.IntegerField()
    life_state_dead = models.IntegerField()
    rank_tier = models.IntegerField(null=True, blank=True)

    class Meta:
      constraints = [
          models.UniqueConstraint(fields=['match', 'account'], name='unique_match_account')
      ]
    
    def __str__(self):
        return f'{self.account.steam_name or self.account.account_id} in match {self.match.match_id}'

class Pause(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='pauses')
    time = models.IntegerField()
    duration = models.IntegerField()

    def __str__(self):
        return f'{self.duration} second pause at {self.time} seconds into the game'
    
class Objective(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='objectives')
    time = models.IntegerField()
    type = models.CharField(max_length=50)
    unit = models.CharField(max_length=50, null=True, blank=True)
    key = models.CharField(max_length=50, null=True, blank=True)
    slot = models.IntegerField(null=True, blank=True)
    player_slot = models.IntegerField(null=True, blank=True)
    team = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'{self.type} at {self.time} into the game'

class Pick(models.Model):
    class Type(models.TextChoices):
      PICK = 'Pick'
      BAN = 'Ban'

    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='picks')
    type = models.TextField(max_length=5, choices=Type.choices)
    hero = models.IntegerField(choices=Hero.choices)
    team = models.CharField(max_length=10, choices=Team.choices)
    order = models.IntegerField()

    def __str__(self):
        return f'{self.team} picked {self.hero} in match {self.match.match_id}'

