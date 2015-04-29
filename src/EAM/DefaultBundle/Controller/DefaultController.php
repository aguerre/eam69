<?php

namespace EAM\DefaultBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use EAM\DefaultBundle\Form\Model\Contact;
use EAM\DefaultBundle\Form\Type\ContactType;

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/contact")
     * @Template()
     */
    public function contactAction()
    {
        $model = new Contact();
        $type = new ContactType();

        $form = $this->get('form.factory')->create($type, $model);

        return array(
            'form' => $form->createView()
        );
    }

    /**
     * @Route(path="/contact")
     * @Template("RadioMetalDefaultBundle:Default:contact.html.twig")
     * @Method({"POST"})
     */
    public function sendContactAction(Request $request)
    {
        $model = new Contact;
        $type  = new ContactType;
        $form  = $this->get('form.factory')->create($type, $model);
        $form->handleRequest($request);

        if ($form->isValid()) {

            $message = \Swift_Message::newInstance()
                    ->setSubject('Contact site web')
                    ->setFrom($model->getEmail())
                    ->setTo('e.a.m69@orange.fr')
                    ->setBody(
                        $this->renderView(
                            'EAMDefaultBundle:Email:email.txt.twig',
                            array(
                                'nom'     => $model->getNom(),
                                'email'   => $model->getEmail(),
                                'sujet'   => $model->getSujet(),
                                'message' => $model->getMessage()
                            )
                        )
                    )
            ;
            $this->get('mailer')->send($message);
        }
        
        return $this->redirect($this->generateUrl('contact'));
    }

    /**
     * @Route("/all-albums")
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:default:albums.html.twig")
     */
    public function albumsAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $albums = $em->getRepository('EAMDefaultBundle:Album')->findAll();

        return array(
            'albums' => $albums,
            'annee' => 'Toutes',
            'categorie' => 'Toutes'
        );
    }

    /**
     * @Route("/albums/categorie-{categorie}", requirements={"categorie"=".+"})
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:default:albums.html.twig")
     */
    public function albumsInCategorieAction(Request $request, $categorie)
    {
        $realCategories = [
            "competition" => "Competition",
            "entrainement" => "Entrainement",
            "manifestations" => "Manifestations"
        ];

        $realCategorie = null;
        foreach ($realCategories as $fake => $real) {
            if ($fake === $categorie) {
                $realCategorie = $real;
            }
        }

        $em = $this->getDoctrine()->getManager();
        $albums = $em->getRepository('EAMDefaultBundle:Album')->findByCategorie($realCategorie);

        return array(
            'albums' => $albums,
            'annee' => 'Toutes',
            'categorie' => $realCategorie
        );
    }

    /**
     * @Route("/albums/annee-{annee}", requirements={"annee"="\d{4}"})
     * @Method({"GET"})
     * @Template("EAMDefaultBundle:default:albums.html.twig")
     */
    public function albumsInAnneeAction(Request $request, $annee = null)
    {
        $em = $this->getDoctrine()->getManager();
        $albums = $em->getRepository('EAMDefaultBundle:Album')->findBy(['year' => $annee]);

        return array(
            'albums' => $albums,
            'annee' => $annee,
            'categorie' => 'Toutes'
        );
    }

    /**
     * @Route("/album-{id}", requirements={"id"="\d+"})
     * @Method({"GET"})
     * @Template
     */
    public function albumAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('EAMDefaultBundle:Album');
        $album = $repository->find($id);

        if ($album === null) {
            throw $this->createNotFoundException('Album[id='.$id.'] inexistant.');
        }

        return array(
            'album' => $album
        );
    }
}
