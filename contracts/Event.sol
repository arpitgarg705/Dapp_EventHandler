pragma solidity ^0.5.9;
contract Event {

    //enum Category {Dance, Music, Paint}
    string[] Category;
    // categories of artists
    
    struct Artist {
        address addr;
        string category;
        uint quote;
        uint timestamp;
		uint8 selected;
       // artist details;
    }
    
    struct Venue {
        address addr;
        uint quote;
        uint area;
        uint timestamp;
		uint8 selected;
       // venue details;
    }
    
    struct Sponsor {
        address addr;
        uint quote;
        uint timestamp;
		uint8 selected;
       // sponsor details;
    }
    
    struct PublicityManager {
        address addr;
        uint quote;
        uint timestamp;
		uint8 selected;
       // publicity manager details;
    }
    
    struct Participant {
        address addr;
        uint8 count;
        uint timestamp;
       // participants details;
    }

    address public eventHead;
    string public location;
    string public eventName; 
    string public eventDescription;
    uint8 public fees;
    uint8 maxAllowed;
    uint8 artistsNum;
    
    mapping(address => Artist) public artists;
    mapping(address => Venue) public venues;
    mapping(address => Sponsor) public sponsors;
    mapping(address => PublicityManager) public publicitymanagers;
    mapping(address => Participant) participants;
    
    address[] artistsArr;
    address[] sponsorsArr;
    address venue;
    address publicitymanager;
    uint artistsArrCnt;
    uint sponsorsArrCnt;
    uint participantCnt;

    /// Create a new eevnt with its details.
    constructor() public {
        eventHead = msg.sender;
        eventName = "ABC";
        eventDescription = "abc";
        location = "xyz";
        fees = 250;
        maxAllowed = 200;
        artistsNum = 3;
        artistsArr.length = 3;
        sponsorsArr.length = 4;
        Category = ['Dance', 'Music', 'Paint'];
         
    }

    
    // Registration modifier
    modifier validRegistration()
    { require(artists[msg.sender].timestamp == 0 && venues[msg.sender].timestamp == 0 && sponsors[msg.sender].timestamp == 0 && publicitymanagers[msg.sender].timestamp == 0 && participants[msg.sender].timestamp == 0);
      _;
    }
    
    // participant count modifier
    modifier validCount(uint8 _count)
    { require((participantCnt+_count) <= maxAllowed);
      _;
    }
    
    // Selection modifier
    modifier validSelection(address _addr, string memory role)
    { require(msg.sender == eventHead && (artists[_addr].timestamp != 0 || venues[_addr].timestamp != 0 || sponsors[_addr].timestamp != 0 || publicitymanagers[_addr].timestamp != 0 || participants[_addr].timestamp == 0) && (artistsArr.length>=artistsArrCnt) && (sponsorsArr.length>=sponsorsArrCnt));
      if(keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Artist"))){
          require(artists[_addr].selected != 1);
      }
      else if(keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Sponsor"))){
          require(sponsors[_addr].selected != 1);
      }
      else if(keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Venue"))){
          require(venues[_addr].selected != 1);
      }
      else if(keccak256(abi.encodePacked(role)) == keccak256(abi.encodePacked("Publicitymanager"))){
          require(publicitymanagers[_addr].selected != 1);
      }
      _;
    }
    
    
    event artistReg(address _addr, string _category, uint _quote);
    /// let an artist register.
    function artistRegister(uint8 _category, uint _quote) public validRegistration() {
        //if (artists[msg.sender].timestamp != 0) return;
        
        artists[msg.sender].category = Category[_category];
        artists[msg.sender].quote = _quote;
        artists[msg.sender].timestamp = now;
        
        emit artistReg(msg.sender, Category[_category], _quote);
    }
    
    event venueReg(address _addr, uint _area, uint _quote);
    /// let a venue register.
    function venueRegister(uint _area, uint _quote) public validRegistration() {
        //if (venues[msg.sender].timestamp != 0) return;
        
        venues[msg.sender].area = _area;
        venues[msg.sender].quote = _quote;
        venues[msg.sender].timestamp = now;
        
        emit venueReg(msg.sender, _area, _quote);
    }
    
    event sponsorReg(address _addr, uint _quote);
    /// let a sponsor register.
    function sponsorRegister(uint _quote) public validRegistration() {
        //if (sponsors[msg.sender].timestamp != 0) return;
        
        sponsors[msg.sender].quote = _quote;
        sponsors[msg.sender].timestamp = now;
        
        emit sponsorReg(msg.sender, _quote);
    }
    
    event publicitymanagerReg(address _addr, uint _quote);
    /// let a publicity manager register.
    function publicitymanagerRegister(uint _quote) public validRegistration() {
        //if (publicitymanagers[msg.sender].timestamp != 0) return;
        
        publicitymanagers[msg.sender].quote = _quote;
        publicitymanagers[msg.sender].timestamp = now;
        
        emit publicitymanagerReg(msg.sender, _quote);
    }
    
    event participantReg(address _addr, uint8 _count);
    /// let a participant register.
    function participantRegister(uint8 _count) public validRegistration() validCount(_count){
        //if (participants[msg.sender].timestamp != 0) return;
        
        participants[msg.sender].count = _count;
        participants[msg.sender].timestamp = now;
        participantCnt += _count;
        
        emit participantReg(msg.sender, _count);
    }
	
    event artistSelect(address _addr);
    /// Select a registered artist.
    function selectArtist(address _addr) public validSelection(_addr,"Artist") {
        //if (msg.sender == eventHead && artists[_addr].timestamp == 0) return;
        
        artistsArr[artistsArrCnt] = _addr;
        artistsArrCnt = artistsArrCnt+1;
		artists[_addr].selected = 1;
		
		emit artistSelect(msg.sender);
    }
    
	event sponsorSelect(address _addr);
    /// Select a registered sponsor.
    function selectSponsor(address _addr) public validSelection(_addr,"Sponsor") {
        sponsorsArr[sponsorsArrCnt] = _addr;
        sponsorsArrCnt = sponsorsArrCnt+1;
		sponsors[_addr].selected = 1;
		
		emit sponsorSelect(msg.sender);
    }
    
	event VenueSelect(address _addr);
    /// Select a registered venue.
    function selectVenue(address _addr) public validSelection(_addr,"Venue") {
        venue = _addr;
		venues[_addr].selected = 1;
		
		emit VenueSelect(msg.sender);
    }
    
	event PublicitymanagerSelect(address _addr);
    /// Select a registered publicity manager.
    function selectPublicitymanager(address _addr) public validSelection(_addr,"Publicitymanager") {
        publicitymanager = _addr;
		publicitymanagers[_addr].selected = 1;
		
		emit PublicitymanagerSelect(msg.sender);
    }

}
 
