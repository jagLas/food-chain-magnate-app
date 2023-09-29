import './About.css'

export default function About () {
    return (
        <>
        
        <h2>About this site</h2>
        <div id='about' className='flex column'>
            
            <div className='flex column'>
                <h3>How to use</h3>
                <p>
                    This site can be used to store and track data for the board game 
                    <a
                        target='_blank'
                        href="https://www.splottershop.com/products/food-chain-magnate"
                        style={{textDecoration: 'none'}}
                    > Food Chain Magnate </a> by Splotter Spellen.
                    This app is intended as a companion app to simplify game calculations.
                    It is not intended to replace the game. You will still need a physical
                    copy to play, which can be purchased at Splotter's website.
                </p>
                <p>
                    If this is your first time using this site, begin by navigating to the Create
                    Player page and create one player for each person who will be playing.
                </p>
                <p>
                    After you have created players, navigate to the Create Game page.
                    Select who will be playing in this game from the players you created and press Create Game.
                </p>
                <p>
                    Once the game has been created, you can modify round information in the Rounds table
                    for each player.
                    Data such First Burger, First Pizza, First Drink, First Waitress, and CFO will automatically
                    carry over when new rounds are created. New rounds can be created by pressing the "+" tab at the top
                    of the Rounds table. You can also switch between rounds at any time by clicking the numbered tabs.
                </p>
                <p>
                    Sales can be added to a round using the top of the Sales table. Specify who the sale is for,
                    and enter the necessary information for the sale, i.e., if the house has a garden and how many
                    of each type of product is sold. House number is currently optional.
                </p>
                <p>
                    After submitting a sale or modifying a round, all calculations will update automatically.
                    Totals for each round can be seen in the Rounds table, and Game totals can be seen in the totals table
                    at the top of the page. Hovering over the game totals will reveal additional details.
                </p>
                <p>
                    When enough money has been removed from the bank, a popup will ask you to add the bank reserve
                    information before you can continue. If you make a mistake when entering this information,
                    you can change it by hovering over the bank tab of the Totals table.
                </p>
                <p>
                    Games can be loaded or deleted at any time in the View Games page.
                    Players can be viewed, modified, or deleted in the View Players page.
                </p>
            </div>
            <div className='flex column'>
                <h3>Technologies</h3>
                <p>This site's frontend is built with React; the backend is built in Python.</p>
            </div>
            <div className='flex column'>
                <h3>Additional Credit</h3>
                <p>
                    This site's design is inspired by the design from the board game 
                    Food Chain Magnate. Site logo is a modification
                    of the box art from the board game.
                </p>

                <p>This site uses the following free webfonts:</p>
                <ul>
                    <li><a target="blank" href="https://webfonts.ffonts.net/Bazooka-Regular.font">Bazooka Regular</a></li>
                    <li>
                        <a target="blank" href="https://fonts.google.com/specimen/Pacifico">Pacifico </a>
                    </li>
                    <li>
                        <a target="blank" href="https://www.dafont.com/anja-eliane.font">Anja Eliane</a>
                    </li>
                </ul>
            </div>

        </div>
        </>
    )
}